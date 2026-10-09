"use client";
import { useMemo, useState } from "react";
import { CalendarDays, Check, Clock3, Plus, ArrowRight } from "lucide-react";
import { type Appointment } from "@/lib/types";
import { dateTimeInZone, zonedDateTimeCandidates, zonedDateTimeToIso, type ClockChangeOccurrence } from "./appointment-time";
import { useAdmin } from "./admin-provider";
import { Button, Empty, ErrorMessage, Field, formatDate, Modal, money, PageHeading } from "./admin-ui";
export function Appointments() {
 const {data,request,setNotice}=useAdmin();
 const [creating,setCreating]=useState(false);const [editing,setEditing]=useState<Appointment|null>(null);
 const [name,setName]=useState("");const [service,setService]=useState("Consultation");const [startsAt,setStartsAt]=useState("");
 const [timezone,setTimezone]=useState("");const [duration,setDuration]=useState(45);const [notes,setNotes]=useState("");
 const [occurrence,setOccurrence]=useState<ClockChangeOccurrence|"">("");const [preservedInstant,setPreservedInstant]=useState("");
 const [error,setError]=useState("");const [busy,setBusy]=useState(false);const [showCancelled,setShowCancelled]=useState(false);
 const businessTimezone=data?.settings.timezone||"Australia/Melbourne";const selectedTimezone=timezone||businessTimezone;
 const candidates=useMemo(()=>{if(!startsAt)return [];try{return zonedDateTimeCandidates(startsAt,selectedTimezone);}catch{return [];}},[startsAt,selectedTimezone]);
 if(!data)return null;
 const deviceTimezone=Intl.DateTimeFormat().resolvedOptions().timeZone;
 const preservedOccurrence=preservedInstant&&candidates.length>1?candidates.findIndex(candidate=>Math.abs(Date.parse(candidate)-Date.parse(preservedInstant))<60000):-1;
 const selectedOccurrence=occurrence||(preservedOccurrence===0?"earlier":preservedOccurrence>0?"later":"");
 function open(appointment?:Appointment) {
  setEditing(appointment||null);setName(appointment?.name||"");setService(appointment?.service||"Consultation");
  setTimezone(businessTimezone);setStartsAt(appointment?dateTimeInZone(appointment.startsAt,businessTimezone):"");
  setDuration(appointment?.durationMinutes||45);setNotes(appointment?.notes||"");setOccurrence("");setPreservedInstant(appointment?.startsAt||"");setError("");setCreating(true);
 }
 function changeTimezone(next:string) {
  if(startsAt){try{const instant=zonedDateTimeToIso(startsAt,selectedTimezone,{occurrence:occurrence||undefined,preserveInstant:preservedInstant});setStartsAt(dateTimeInZone(instant,next));setPreservedInstant(instant);setOccurrence("");setError("");}catch(e){setError(e instanceof Error?e.message:"Choose a valid appointment time.");return;}}
  setTimezone(next);
 }
 async function save() {
  setBusy(true);setError("");
  try{
   const result=await request<{appointment:Appointment}>(editing?`/api/admin/appointments/${editing.id}`:"/api/admin/appointments",editing?"PATCH":"POST",{name,service,startsAt:zonedDateTimeToIso(startsAt,selectedTimezone,{occurrence:occurrence||undefined,preserveInstant:preservedInstant}),durationMinutes:duration,notes,status:"confirmed",...(editing?{expectedStartsAt:editing.startsAt,expectedStatus:editing.status}:{})});
   setCreating(false);setEditing(null);setNotice(`${editing?"Appointment rescheduled":"Appointment confirmed"}: ${formatDate(result.appointment.startsAt,true,businessTimezone)} (${businessTimezone}).`);
  }catch(e){setError(e instanceof Error?e.message:"Appointment could not be saved.");}finally{setBusy(false);}
 }
 async function status(appointment:Appointment,newStatus:Appointment["status"]) {
  setBusy(true);setError("");try{await request(`/api/admin/appointments/${appointment.id}`,"PATCH",{status:newStatus,expectedStartsAt:appointment.startsAt,expectedStatus:appointment.status});setNotice(`Appointment ${newStatus}.`);}catch(e){setError(e instanceof Error?e.message:"Could not update appointment.");}finally{setBusy(false);}
 }
 const appointments=data.appointments.filter(a=>showCancelled||a.status!=="cancelled").sort((a,b)=>a.startsAt.localeCompare(b.startsAt));
 return <><PageHeading title="The studio diary." subtitle={`Consultations, fittings and collection appointments. Times shown in ${businessTimezone}.`}><Button onClick={()=>open()}><Plus size={17}/>Add appointment</Button></PageHeading>
  <div className="admin-filter-bar"><label><input type="checkbox" checked={showCancelled} onChange={e=>setShowCancelled(e.target.checked)}/>Show cancelled appointments</label></div><ErrorMessage message={error}/>
  <div className="admin-appointment-list">{appointments.map(appointment=><article key={appointment.id}>
   <div className="admin-appointment-date"><CalendarDays size={18}/><strong>{formatDate(appointment.startsAt,false,businessTimezone)}</strong><span>{new Date(appointment.startsAt).toLocaleTimeString("en-AU",{hour:"numeric",minute:"2-digit",timeZone:businessTimezone})}</span></div>
   <div><h2>{appointment.name}</h2><p>{appointment.service} · {appointment.durationMinutes} minutes</p>{appointment.notes&&<small>{appointment.notes}</small>}</div>
   <span className={`admin-status ${appointment.status === "completed"?"ready":""}`}>{appointment.status}</span>
   <div className="admin-button-row">{appointment.status === "requested"&&<Button variant="secondary" busy={busy} onClick={()=>void status(appointment,"confirmed")}>Confirm</Button>}{appointment.status === "confirmed"&&<Button variant="secondary" busy={busy} onClick={()=>void status(appointment,"completed")}><Check size={15}/>Complete</Button>}{!["completed","cancelled"].includes(appointment.status)&&<><Button variant="secondary" disabled={busy} onClick={()=>open(appointment)}>Reschedule</Button><Button variant="ghost" busy={busy} onClick={()=>void status(appointment,"cancelled")}>Cancel</Button></>}</div>
  </article>)}{!appointments.length&&<Empty title="The diary is clear">Add a confirmed consultation after agreeing a time with the customer.</Empty>}</div>
  {creating&&<Modal title={editing?"Reschedule appointment":"Add appointment"} onClose={()=>setCreating(false)}><form onSubmit={e=>{e.preventDefault();void save();}}>
   <Field label="Customer name"><input required value={name} readOnly={!!editing} onChange={e=>setName(e.target.value)}/></Field>
   <Field label="Appointment type"><select value={service} onChange={e=>setService(e.target.value)}>{["Consultation","Measurements","First fitting","Second fitting","Final fitting","Collection","Alteration assessment"].map(s=><option key={s}>{s}</option>)}</select></Field>
   {editing&&<p className="admin-muted">Currently {formatDate(editing.startsAt,true,businessTimezone)} · {businessTimezone}. Saving checks for overlapping confirmed appointments.</p>}
   <Field label="Time zone"><select value={timezone||businessTimezone} onChange={e=>changeTimezone(e.target.value)}><option value={businessTimezone}>Studio · {businessTimezone}</option>{deviceTimezone!==businessTimezone&&<option value={deviceTimezone}>Your device · {deviceTimezone}</option>}</select></Field>
   <div className="admin-form-grid"><Field label={`Date & time (${selectedTimezone})`}><input type="datetime-local" required value={startsAt} onChange={e=>{setStartsAt(e.target.value);setOccurrence("");}}/></Field><Field label="Duration (minutes)"><input type="number" min={15} max={180} step={15} required value={duration} onChange={e=>setDuration(Number(e.target.value))}/></Field></div>
   {candidates.length>1&&<Field label="Clock-change occurrence" hint="This local time occurs twice. Choose which appointment time you mean."><select required value={selectedOccurrence} onChange={e=>setOccurrence(e.target.value as ClockChangeOccurrence|"")}><option value="">Choose earlier or later</option>{candidates.map((instant,index)=><option key={instant} value={index===0?"earlier":"later"}>{index===0?"Earlier":"Later"} · {new Intl.DateTimeFormat("en-AU",{timeZone:selectedTimezone,hour:"numeric",minute:"2-digit",timeZoneName:"shortOffset"}).format(new Date(instant))}</option>)}</select></Field>}
   <Field label="Notes"><textarea value={notes} onChange={e=>setNotes(e.target.value)}/></Field><ErrorMessage message={error}/><Button type="submit" busy={busy}>{editing?"Save new appointment time":"Confirm appointment"}<ArrowRight size={16}/></Button>
  </form></Modal>}
 </>;
}
export function Attendance() {
 const {data,request,setNotice}=useAdmin();const [busy,setBusy]=useState(false);const [error,setError]=useState("");if(!data)return null;const user=data.session.user;const timezone=data.settings.timezone;const today=new Intl.DateTimeFormat("en-CA",{timeZone:timezone,year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());const own=data.attendance.filter(a=>a.staffId===user.id&&a.date===today);const active=own.find(a=>!a.clockOut);const completed=own.some(a=>!!a.clockOut);
 async function clock() {setBusy(true);setError("");try{await request("/api/admin/attendance","POST",{action:active?"clock_out":"clock_in"});setNotice(active?"You have clocked out.":"Your working session has started.");}catch(e){setError(e instanceof Error?e.message:"Could not record attendance.");}finally{setBusy(false);}}
 return <><PageHeading title="Team attendance" subtitle={`A clear record of working sessions across both teams. Times shown in ${timezone}.`}/><div className="admin-clock-panel"><Clock3 size={24}/><div><span>{formatDate(today)}</span><h2>{active?"You are clocked in.":completed?"Your day is recorded.":"Ready for the day?"}</h2><p>{active?`Started at ${formatDate(active.clockIn,true,timezone)}`:completed?"Your completed working session is preserved below.":"Record the beginning and end of your working session."}</p></div><Button busy={busy} disabled={completed&&!active} onClick={()=>void clock()}>{active?"Clock out":completed?"Day recorded":"Clock in"}<ArrowRight size={17}/></Button></div><ErrorMessage message={error}/><div className="admin-section-label"><h2>Working sessions</h2></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Team member</th><th>Date</th><th>Clock in</th><th>Clock out</th><th>Duration</th></tr></thead><tbody>{data.attendance.slice().sort((a,b)=>b.clockIn.localeCompare(a.clockIn)).map(record=><tr key={record.id}><td>{data.staff.find(s=>s.id===record.staffId)?.name||"Team member"}</td><td>{formatDate(record.date)}</td><td>{formatDate(record.clockIn,true,timezone)}</td><td>{record.clockOut?formatDate(record.clockOut,true,timezone):<span className="admin-status ready">Working</span>}</td><td>{record.clockOut?`${((new Date(record.clockOut).getTime()-new Date(record.clockIn).getTime())/3600000).toFixed(1)} h`:"—"}</td></tr>)}</tbody></table>{!data.attendance.length&&<Empty title="No attendance recorded yet"/>}</div></>;
}
export function Revenue() {
 const {data}=useAdmin();if(!data)return null;const sum=(status:string)=>data.invoices.filter(i=>i.status===status).reduce((total,i)=>total+i.lines.reduce((value,line)=>value+line.quantity*line.unitPrice,0),0);const paid=sum("paid");const outstanding=sum("sent");
 return <><PageHeading title="Revenue" subtitle="Recorded revenue from the business ledger. All values are in AUD."/><div className="admin-revenue-summary"><div><span>Recorded payments</span><strong>{money(paid)}</strong><small>{data.invoices.filter(i=>i.status==="paid").length} paid records</small></div><div><span>Outstanding</span><strong>{money(outstanding)}</strong><small>{data.invoices.filter(i=>i.status==="sent").length} open records</small></div><div><span>Active commissions</span><strong>{data.orders.filter(o=>o.status==="active").length}</strong><small>Operational order count</small></div></div><div className="admin-section-label"><h2>Recorded payments</h2></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Reference</th><th>Customer</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead><tbody>{data.invoices.filter(i=>["paid","sent"].includes(i.status)).map(record=><tr key={record.id}><td className="admin-mono">{record.number}</td><td>{data.customers.find(c=>c.id===record.customerId)?.name}</td><td>{formatDate(record.paidAt||record.createdAt)}</td><td>{money(record.lines.reduce((s,l)=>s+l.quantity*l.unitPrice,0))}</td><td><span className={`admin-status ${record.status==="paid"?"ready":"attention"}`}>{record.status==="paid"?"Paid":"Outstanding"}</span></td></tr>)}</tbody></table>{!data.invoices.length&&<Empty title="No financial records">Revenue will appear after real payment records are imported or connected.</Empty>}</div><p className="admin-table-caption">Only recorded payments appear here. Development workspace records are illustrative.</p></>;
}
