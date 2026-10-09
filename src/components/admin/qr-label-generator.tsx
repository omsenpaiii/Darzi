"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Check, Printer, Search, X } from "lucide-react";
import { canPrintGarment, MAX_LABEL_COPIES, MAX_LABEL_GARMENTS } from "@/lib/qr-labels";
import { useAdmin } from "./admin-provider";
import { Button, Field, Status } from "./admin-ui";

export function QrLabelGenerator() {
  const { data } = useAdmin();
  const [query, setQuery] = useState("");
  const [includeCompleted, setIncludeCompleted] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copies, setCopies] = useState(1);
  const [limit, setLimit] = useState(8);
  const orders = useMemo(() => new Map(data?.orders.map(order => [order.id, order])), [data?.orders]);
  const customers = useMemo(() => new Map(data?.customers.map(customer => [customer.id, customer])), [data?.customers]);
  const matches = useMemo(() => {
    const search = query.trim().toLowerCase();
    return (data?.items || []).filter(item => {
      if (!includeCompleted && item.stage === "completed") return false;
      if (!search && !canPrintGarment(item)) return false;
      const order = orders.get(item.orderId);
      const customer = order && customers.get(order.customerId);
      return !search || [item.number, item.name, item.garmentType, item.fabricReference, item.qrToken, order?.number, customer?.name].some(value => value?.toLowerCase().includes(search));
    }).sort((a, b) => (orders.get(a.orderId)?.dueDate || "9999").localeCompare(orders.get(b.orderId)?.dueDate || "9999") || a.number.localeCompare(b.number));
  }, [data?.items, orders, customers, query, includeCompleted]);
  const selected = (data?.items || []).filter(item => selectedIds.includes(item.id) && canPrintGarment(item));
  const visible = matches.slice(0, limit);
  const printableMatches = matches.filter(canPrintGarment);
  const atLimit = selected.length >= MAX_LABEL_GARMENTS;
  const previewParams = new URLSearchParams({ items: selected.map(item => item.id).join(","), copies: String(copies) });

  if (!data) return null;
  function toggle(id: string) {
    setSelectedIds(previous => previous.includes(id) ? previous.filter(value => value !== id) : previous.length < MAX_LABEL_GARMENTS ? [...previous, id] : previous);
  }

  return <>
    <div className="admin-scan-divider"><span>OR</span></div>
    <section className="admin-qr-generator" aria-labelledby="qr-generator-heading">
      <div className="admin-qr-heading">
        <div><h2 id="qr-generator-heading">Generate & print QR labels.</h2><p>Make the first label for an existing garment, or replace a worn one. Every reprint opens the same record.</p></div>
        <Printer size={27} strokeWidth={1.3} aria-hidden="true" />
      </div>
      <ol className="admin-qr-steps"><li><span>01</span>Find the garment</li><li><span>02</span>Preview & print</li><li><span>03</span>Attach, then scan</li></ol>
      <div className="admin-qr-layout">
        <div className="admin-qr-picker">
          <label className="admin-field"><span>Find garments for labels</span><div className="admin-search"><Search size={17} aria-hidden="true"/><input type="search" aria-label="Find garments for labels" placeholder="Customer, order number or garment" value={query} onChange={event => { setQuery(event.target.value); setLimit(8); }} autoComplete="off" /></div></label>
          <div className="admin-qr-results-toolbar">
            <label className="admin-checkbox"><input type="checkbox" checked={includeCompleted} onChange={event => { setIncludeCompleted(event.target.checked); setLimit(8); }} />Include completed garments</label>
            <Button variant="ghost" disabled={!printableMatches.length || atLimit} onClick={() => setSelectedIds(previous => [...new Set([...previous, ...printableMatches.map(item => item.id)])].slice(0, MAX_LABEL_GARMENTS))}>Select matches</Button>
          </div>
          <p className="admin-qr-result-count" role="status">{matches.length ? `Showing ${visible.length} of ${matches.length} garments` : "No matching garments"}{atLimit ? ` · ${MAX_LABEL_GARMENTS}-garment limit reached` : ""}</p>
          <div className="admin-qr-results">
            {visible.map(item => {
              const order = orders.get(item.orderId);
              const customer = order && customers.get(order.customerId);
              const printable = canPrintGarment(item);
              return <div className={`admin-qr-result ${selectedIds.includes(item.id) ? "selected" : ""}`} key={item.id}>
                <label><input type="checkbox" aria-label={`Select ${item.number}`} checked={selectedIds.includes(item.id)} disabled={!printable || atLimit && !selectedIds.includes(item.id)} onChange={() => toggle(item.id)} /><div><strong>{item.name}</strong><span>{customer?.name || "Customer record"}</span><small>{item.number} · {order?.number}</small></div></label>
                <div className="admin-qr-result-state"><Status item={item} />{!printable && <Link href={item.stage === "draft" ? `/admin/intake?draft=${item.orderId}` : `/admin/items/${item.id}`}>{item.stage === "draft" ? "Finish intake" : "Send to India first"}<ArrowRight size={13}/></Link>}</div>
              </div>;
            })}
            {!matches.length && <div className="admin-qr-no-results"><Search size={23}/><h3>{query ? "Try a name or order number." : "No issued garments yet."}</h3><p>{query ? "Check the spelling or include completed garments to find an older label." : "Save the commission and send it to India to issue its garment labels."}</p>{data.session.user.team !== "IN" && <Link href="/admin/intake" className="admin-text-link">Create a commission<ArrowRight size={14}/></Link>}</div>}
          </div>
          {matches.length > limit && <Button variant="secondary" className="admin-qr-show-more" onClick={() => setLimit(previous => previous + 8)}>Show more garments</Button>}
        </div>
        <aside className="admin-qr-print-job" aria-label="Your label print job">
          <div className="admin-qr-job-heading"><Printer size={19}/><h3>Your print job</h3><span>{selected.length}</span></div>
          {selected.length ? <ul className="admin-qr-selected">{selected.map(item => <li key={item.id}><div><strong>{item.name}</strong><span>{item.number}</span></div><button className="admin-icon-button" aria-label={`Remove ${item.number} from print job`} onClick={() => toggle(item.id)}><X size={16}/></button></li>)}</ul> : <p className="admin-qr-selection-hint">Select a garment to prepare its label. Choose multiple pieces to print a whole commission together.</p>}
          <Field label="Copies per garment"><select value={copies} onChange={event => setCopies(Number(event.target.value))}>{Array.from({ length: MAX_LABEL_COPIES }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}{index ? " copies" : " copy"}</option>)}</select></Field>
          <div className="admin-qr-job-summary"><span>Label size</span><strong>{data.settings.labelWidthMm} × {data.settings.labelHeightMm} mm</strong><span>Total labels</span><strong>{selected.length * copies}</strong></div>
          {selected.length ? <Link href={`/admin/labels?${previewParams}`} className="admin-button primary admin-qr-preview"><Printer size={17}/>Preview & print<ArrowRight size={16}/></Link> : <Button disabled className="admin-qr-preview"><Printer size={17}/>Preview & print<ArrowRight size={16}/></Button>}
          {selected.length > 0 && <Button variant="ghost" onClick={() => setSelectedIds([])}>Clear selection</Button>}
          <p className="admin-qr-reprint-note"><Check size={15}/><span>Reprints keep the original QR. Printing does not move the garment to another stage.</span></p>
        </aside>
      </div>
      <p className="admin-qr-workflow-note">A code is assigned when intake is saved. Print its workshop label after sending the commission to India, when the garment list is final. Attach one label to each piece or its job sheet; scan it at the next handover.</p>
    </section>
  </>;
}
