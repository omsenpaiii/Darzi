"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Camera, CameraOff, Printer, ScanLine, Search, Upload, ArrowRight } from "lucide-react";
import { type GarmentItem } from "@/lib/types";
import { GARMENT_QR_OPTIONS, garmentQrUrl, parseGarmentCode, resolveLabelJob, resolveQrOrigin } from "@/lib/qr-labels";
import { useAdmin } from "./admin-provider";
import { Button, Empty, ErrorMessage, Field, PageHeading } from "./admin-ui";
import { QrLabelGenerator } from "./qr-label-generator";
import { StitchMark } from "@/components/shared/StitchLoader";
type Detector = { detect: (source:HTMLVideoElement) => Promise<{rawValue:string}[]> };
type DetectorConstructor = new (options:{formats:string[]}) => Detector;
export function Scan() {
 const {data,request}=useAdmin();
 const router=useRouter();
 const [code,setCode]=useState("");
 const [error,setError]=useState("");
 const [busy,setBusy]=useState(false);
 const [camera,setCamera]=useState(false);
 const [opening,setOpening]=useState(false);
 const video=useRef<HTMLVideoElement>(null);
 const stream=useRef<MediaStream|null>(null);
 const frame=useRef<number>(0);
 const readerControls=useRef<{stop:()=>void}|null>(null);
 const matched=useRef(false);
 const mounted=useRef(true);
 const cameraGeneration=useRef(0);
 const lookupGeneration=useRef(0);
 const cameraPending=useRef(false);

 function releaseCamera(){
  cancelAnimationFrame(frame.current);
  readerControls.current?.stop();readerControls.current=null;
  stream.current?.getTracks().forEach(track=>track.stop());stream.current=null;
 }
 function stop(){
  cameraGeneration.current++;cameraPending.current=false;releaseCamera();
  if(mounted.current){setCamera(false);setOpening(false);}
 }
 useEffect(()=>{
  mounted.current=true;
  return()=>{mounted.current=false;cameraGeneration.current++;lookupGeneration.current++;releaseCamera();};
 },[]);
 async function lookup(value=code){
  const lookupId=++lookupGeneration.current;
  matched.current=true;stop();setBusy(true);setError("");
  try{
   const origin=resolveQrOrigin(process.env.NEXT_PUBLIC_SITE_URL,window.location.origin);
   const lookupCode=parseGarmentCode(value,[window.location.origin,origin]);
   const cached=data?.items.find(item=>item.id===lookupCode||item.qrToken===lookupCode||item.number.toLowerCase()===lookupCode.toLowerCase());
   const target=`/admin/items/${encodeURIComponent(lookupCode)}`;
   // The usual scan resolves from the already authorised workspace, then the
   // destination refreshes status. Unknown codes use the authoritative resolver.
   const item=cached||(await request<{item:GarmentItem}>(`/api/admin/qr?code=${encodeURIComponent(lookupCode)}`,"GET",undefined,target)).item;
   if(mounted.current&&lookupId===lookupGeneration.current)router.push(`/admin/items/${encodeURIComponent(item.id)}`);
  }catch(e){if(mounted.current&&lookupId===lookupGeneration.current)setError(e instanceof Error?e.message:"Garment not found. Check the printed ID.");}
  finally{if(mounted.current&&lookupId===lookupGeneration.current)setBusy(false);}
 }
 async function start(){
  if(cameraPending.current||stream.current||busy)return;
  setError("");matched.current=false;
  if(!navigator.mediaDevices?.getUserMedia){setError("Camera access requires HTTPS. Use the printed garment ID below.");return;}
  const generation=++cameraGeneration.current;
  cameraPending.current=true;setOpening(true);
  try{
   const source=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:false});
   if(!mounted.current||generation!==cameraGeneration.current){source.getTracks().forEach(track=>track.stop());return;}
   stream.current=source;cameraPending.current=false;setOpening(false);setCamera(true);
  }catch(e){
   if(!mounted.current||generation!==cameraGeneration.current)return;
   setError(e instanceof Error&&e.name==="NotAllowedError"?"Camera permission was declined. Enter the printed garment ID below.":"The camera could not be opened. Enter the garment ID instead.");stop();
  }
 }
 useEffect(()=>{
  if(!camera)return;
  const current=video.current,source=stream.current,generation=cameraGeneration.current;
  if(!current||!source)return;
  const active=()=>mounted.current&&generation===cameraGeneration.current&&!matched.current;
  async function detect(){
   if(!current||!source)return;
   current.srcObject=source;await current.play();
   if(!active())return;
   const Barcode=(window as unknown as {BarcodeDetector?:DetectorConstructor}).BarcodeDetector;
   if(Barcode){
    const detector=new Barcode({formats:["qr_code"]});
    const scan=async()=>{
     if(!active())return;
     if(current.readyState>=2){
      try{const results=await detector.detect(current);if(active()&&results[0]){matched.current=true;void lookup(results[0].rawValue);return;}}catch{}
     }
     if(active())frame.current=requestAnimationFrame(()=>void scan());
    };
    void scan();
   }else{
    const {BrowserQRCodeReader}=await import("@zxing/browser");
    if(!active())return;
    const controls=await new BrowserQRCodeReader(undefined,{delayBetweenScanAttempts:150,delayBetweenScanSuccess:300}).decodeFromStream(source,current,result=>{if(active()&&result){matched.current=true;void lookup(result.getText());}});
    if(!active())controls.stop();else readerControls.current=controls;
   }
  }
  void detect().catch(()=>{if(active()){setError("QR scanning could not start. Enter the printed garment ID below.");stop();}});
  return()=>{cancelAnimationFrame(frame.current);};
 },[camera]);
 return <>
  <PageHeading title="Scan. Find. Move." subtitle="One QR leads directly to the garment and its next production step."/>
  <div className="admin-scan-layout">
   <section className="admin-camera-panel">
    {camera?<><video ref={video} playsInline muted/><div className="admin-camera-frame"/><Button variant="secondary" onClick={stop}><CameraOff size={17}/>Stop camera</Button></>:<>
     <ScanLine size={70} strokeWidth={1}/><h2>Point at a garment QR</h2><p>Use the label attached to the garment or its order paperwork.</p>
     <Button busy={opening} disabled={busy} onClick={()=>void start()}><Camera size={17}/>{opening?"Opening camera…":"Open camera"}</Button>
     {opening&&<Button variant="ghost" onClick={stop}>Cancel camera request</Button>}
    </>}
   </section>
   <section className="admin-scan-manual"><h2>Or use the garment ID.</h2><p>The same record opens from a printed item number, QR token or saved link.</p>
    <form onSubmit={event=>{event.preventDefault();void lookup();}}>
     <Field label="Garment ID / QR token"><input placeholder="e.g. DZ-2026-1021-1" value={code} onChange={event=>setCode(event.target.value)} autoCapitalize="off" autoCorrect="off" spellCheck={false} required/></Field>
     <Button type="submit" busy={busy}><Search size={17}/>Find garment<ArrowRight size={16}/></Button>
    </form><ErrorMessage message={error}/>
   </section>
  </div>
  <QrLabelGenerator/>
 </>;
}
export function Labels() {
 const {data}=useAdmin();const params=useSearchParams();const selection=params.get("items"),copiesParam=params.get("copies");
 const job=useMemo(()=>resolveLabelJob(data?.items||[],selection,copiesParam),[data?.items,selection,copiesParam]);
 const key=job.items.map(item=>`${item.id}:${item.qrToken}`).join("|");
 const [generated,setGenerated]=useState<{key:string;codes:Record<string,string>;origin:string;error:string}>({key:"",codes:{},origin:"",error:""});
 const [attempt,setAttempt]=useState(0);
 useEffect(()=>{
  let cancelled=false;
  setGenerated({key,codes:{},origin:"",error:""});
  if(!job.items.length)return;
  async function generate(){
   try{
    const origin=resolveQrOrigin(process.env.NEXT_PUBLIC_SITE_URL,window.location.origin);
    const QRCode=await import("qrcode");
    const values=await Promise.all(job.items.map(async item=>[item.id,await QRCode.toDataURL(garmentQrUrl(origin,item.qrToken),GARMENT_QR_OPTIONS)]));
    if(!cancelled)setGenerated({key,codes:Object.fromEntries(values),origin,error:""});
   }catch{if(!cancelled)setGenerated({key,codes:{},origin:"",error:"Labels could not be generated. Check your connection and website configuration, then retry."});}
  }
  void generate();return()=>{cancelled=true;};
 },[key,job.items,attempt]);
 if(!data)return null;
 const codes=generated.key===key?generated.codes:{};
 const ready=job.items.length>0&&!job.error&&!generated.error&&job.items.every(item=>Boolean(codes[item.id]));
 const width=data.settings.labelWidthMm,height=data.settings.labelHeightMm;
 const compact=width<60||height<35;
 const localOrigin=generated.origin&&/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::|$)/.test(generated.origin);
 return <>
  <div className="admin-no-print">
   <Link href="/admin/scan" className="admin-back">← Back to Scan & label selection</Link>
   <PageHeading title="Ready for the garment." subtitle="Check the item numbers, then print and attach one label to each piece."><Button onClick={()=>window.print()} disabled={!ready}><Printer size={17}/>Print {job.items.length*job.copies||""} label{job.items.length*job.copies===1?"":"s"}</Button></PageHeading>
   <div className="admin-label-print-guide"><div><strong>{job.items.length} garment{job.items.length===1?"":"s"} · {job.copies} cop{job.copies===1?"y":"ies"} each</strong><p>Stock: {width} × {height} mm. Choose your label printer and matching paper size, set scale to 100%, and turn off headers and footers. You can also save the print job as a PDF.</p></div><span>Original QR identity<br/>No stage change on print</span></div>
   {localOrigin&&<p className="admin-attention">Development labels open {generated.origin} on this computer. Configure the published website address before printing labels for the workshop.</p>}
   <ErrorMessage message={job.error||generated.error}/>
   {generated.error&&<Button variant="secondary" onClick={()=>setAttempt(previous=>previous+1)}>Retry label generation</Button>}
  </div>
  {job.items.length>0&&<>
   <style>{`@media print { @page { size: ${width}mm ${height}mm; margin: 0; } }`}</style>
   <div className={`admin-labels ${compact?"compact":""} ${ready?"ready":""}`} aria-label="Label preview" style={{"--label-width":`${width}mm`,"--label-height":`${height}mm`} as React.CSSProperties}>
    {job.items.flatMap(item=>Array.from({length:job.copies},(_,copy)=><article className="admin-label" key={`${item.id}-${copy}`}>{codes[item.id]?<img src={codes[item.id]} alt={`QR for ${item.number}`} width={110} height={110}/>:<div className="admin-label-loading"><StitchMark compact /><span className="sr-only">Generating QR…</span></div>}<div><strong className="admin-label-wordmark">DARZI</strong><b>{item.number}</b>{!compact&&<span>{item.name}</span>}<small>Scan for garment details</small></div></article>))}
   </div>
  </>}
  {!job.items.length&&<div className="admin-no-print"><Empty title="No labels prepared">Return to Scan to choose the exact garments for this print job.</Empty><Link href="/admin/scan" className="admin-button primary">Choose garments<ArrowRight size={16}/></Link></div>}
 </>;
}
type LegacyRecord = {id:string;boardName:string;name:string;stage:string;closed:boolean;importedAt:string;attachmentCount:number;source:Record<string,unknown>};
export function Legacy() {
 const {data,request,setNotice}=useAdmin();const [board,setBoard]=useState<unknown>(null);const [filename,setFilename]=useState("");const [records,setRecords]=useState<LegacyRecord[]>([]);const [archiveQuery,setArchiveQuery]=useState("");const [archiveRecord,setArchiveRecord]=useState<LegacyRecord|null>(null);const [report,setReport]=useState<{counts?:Record<string,number>;warnings?:string[];imported?:boolean;[key:string]:unknown}|null>(null);const [busy,setBusy]=useState(false);const [error,setError]=useState("");
 useEffect(()=>{void request<{records:LegacyRecord[]}>("/api/admin/legacy/archive","GET").then(result=>setRecords(result.records)).catch(e=>setError(e instanceof Error?e.message:"Archive could not be loaded."));},[request]);
 if(!data)return null;
 async function load(file:File) {setError("");setReport(null);try{const text=await file.text();setBoard(JSON.parse(text));setFilename(file.name);}catch{setError("This file is not a valid JSON board export.");setBoard(null);}}
 async function run(mode:"dry_run"|"import") {setBusy(true);setError("");try{const result=await request<{counts?:Record<string,number>;warnings?:string[];[key:string]:unknown}>("/api/admin/legacy/import","POST",{mode,board});setReport({...result,counts:{cards:Number(result.cards||0),active:Number(result.active||0),completed:Number(result.completed||0),attachments:Number(result.attachments||0)},imported:mode==="import"});if(mode==="import"){const archive=await request<{records:LegacyRecord[]}>("/api/admin/legacy/archive","GET");setRecords(archive.records);}if(mode==="import")setNotice("Legacy source export preserved. Review the reconciliation report.");}catch(e){setError(e instanceof Error?e.message:"The export could not be imported.");}finally{setBusy(false);}}
 return <><PageHeading title="Legacy archive" subtitle="Preserve the old workflow's history while the atelier moves forward."/><div className="admin-legacy-intro"><h2>Trello source import</h2><p>Use a JSON export from each board. Preview validates card, list and attachment counts before any records are imported.</p><p className="admin-muted">Imported source records retain original IDs and timestamps. Remote attachments require copying before Trello is retired.</p>{data.session.user.role==="super_admin"?<><label className="admin-file-upload"><Upload size={17}/>{filename||"Choose a Trello JSON export"}<input type="file" accept="application/json,.json" onChange={e=>{const file=e.target.files?.[0];if(file)void load(file);}}/></label><div className="admin-button-row"><Button variant="secondary" busy={busy} disabled={!board} onClick={()=>void run("dry_run")}>Preview import</Button><Button busy={busy} disabled={!board||!report||report.imported} onClick={()=>void run("import")}>Preserve source archive<ArrowRight size={17}/></Button></div></>:<p className="admin-muted">Only a Super admin can import source exports.</p>}<ErrorMessage message={error}/></div>{report&&<section className="admin-import-report"><h2>{report.imported?"Source preserved":"Import preview"}</h2>{report.counts&&<div className="admin-detail-list">{Object.entries(report.counts).map(([label,value])=><div key={label}><span>{label.replaceAll("_"," ")}</span><strong>{value}</strong></div>)}</div>}{report.warnings?.map((warning,i)=><p className="admin-attention" key={i}>{warning}</p>)}<details><summary>Full reconciliation report</summary><pre>{JSON.stringify(report,null,2)}</pre></details></section>}<section className="admin-archive-list"><div className="admin-section-label"><h2>Preserved source records</h2><span>{records.length} records</span></div><div className="admin-search"><Search size={17}/><input value={archiveQuery} onChange={e=>setArchiveQuery(e.target.value)} placeholder="Search archived card or board" aria-label="Search legacy archive"/></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Original card</th><th>Board / list</th><th>Files</th><th>Imported</th><th>Status</th></tr></thead><tbody>{records.filter(record=>`${record.name} ${record.boardName} ${record.stage}`.toLowerCase().includes(archiveQuery.toLowerCase())).map(record=><tr key={record.id}><td><button className="admin-table-item" onClick={()=>setArchiveRecord(record)}><strong>{record.name}</strong><span>Read-only source</span></button></td><td>{record.boardName}<small className="admin-table-subline">{record.stage}</small></td><td>{record.attachmentCount}</td><td>{new Date(record.importedAt).toLocaleDateString("en-AU")}</td><td>{record.closed?"Archived":"Active in source"}</td></tr>)}</tbody></table>{!records.length&&<Empty title="No source records imported">Upload each board export to preserve its history.</Empty>}</div></section>{archiveRecord&&<div className="admin-archive-detail"><div className="admin-section-label"><h2>{archiveRecord.name}</h2><button className="admin-text-link" onClick={()=>setArchiveRecord(null)}>Close record</button></div><p className="admin-muted">{archiveRecord.boardName} · {archiveRecord.stage} · Original data preserved read-only</p><pre>{JSON.stringify(archiveRecord.source,null,2)}</pre></div>}</>;
}
