import "server-only";
import {randomUUID} from "node:crypto";
import type {Appointment,BusinessSettings,Customer,Lead,StaffUser} from "@/lib/types";
import {transaction} from "./store";
import {requireAustralia,requireOwner} from "./auth";
import {invariant} from "./errors";
import {text,validDate} from "./workspace";
import type {StoredState} from "./model";
function activity(state:StoredState,user:StaffUser,message:string,type="admin"){state.activity.unshift({id:randomUUID(),actorId:user.id,actorName:user.name,type,message,createdAt:new Date().toISOString()});}
export async function updateLead(id:string,input:Partial<Lead>&{note?:string},user:StaffUser){requireAustralia(user);return transaction(state=>{
 const lead=state.leads.find(row=>row.id===id);invariant(lead,"Lead not found.",404);
 invariant(!input.status||["new","contacted"].includes(input.status),"Use conversion to create an intake draft.");
 invariant(!input.status||lead.status!=="converted","A converted enquiry stays linked to its commission.",409,"LEAD_CONVERTED");
 if(input.status)lead.status=input.status;
 if(input.note!==undefined){const note=text(input.note);invariant(note,"Enter a follow-up note.");lead.followUps??=[];lead.followUps.push({id:randomUUID(),note,actorId:user.id,actorName:user.name,createdAt:new Date().toISOString()});}
 activity(state,user,`Updated enquiry follow-up for ${lead.name}`,"lead");return {lead};
});}
export async function updateCustomer(id:string,input:Partial<Customer>,user:StaffUser){requireAustralia(user);return transaction(state=>{const customer=state.customers.find(row=>row.id===id);invariant(customer,"Customer not found.",404);if(input.name!==undefined){invariant(text(input.name,120),"Enter a name.");customer.name=text(input.name,120);}if(input.email!==undefined){invariant(!input.email||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email),"Enter a valid email.");customer.email=text(input.email,200)||undefined;}if(input.phone!==undefined)customer.phone=text(input.phone,40)||undefined;if(input.notes!==undefined)customer.notes=text(input.notes);activity(state,user,"Updated customer details","customer");return {customer};});}
export async function saveAppointment(input:Partial<Appointment>&{expectedStartsAt?:string;expectedStatus?:Appointment["status"]},user:StaffUser,id?:string){
 requireAustralia(user);
 return transaction(state=>{
  const existing=id?state.appointments.find(row=>row.id===id):undefined;
  invariant(!id||existing,"Appointment not found.",404);
  const merged={...existing,...input},startsAt=text(merged.startsAt,40),durationMinutes=merged.durationMinutes??45;
  invariant(text(merged.name,120)&&text(merged.service,100)&&Number.isFinite(Date.parse(startsAt)),"Enter a name, appointment type and valid start time.");
  invariant(Number.isInteger(durationMinutes)&&durationMinutes>=15&&durationMinutes<=180,"Choose a duration from 15 to 180 minutes.");
  const status=merged.status??"confirmed";
  invariant(["requested","confirmed","completed","cancelled"].includes(status),"Invalid appointment status.");
  if(existing){
   const rescheduling=["name","service","startsAt","durationMinutes","notes"].some(key=>Object.prototype.hasOwnProperty.call(input,key));
   const closed=existing.status==="completed"||existing.status==="cancelled";
   invariant(!closed||!rescheduling&&status===existing.status,"This appointment has been completed or cancelled. Close this form and review the studio diary.",409,"APPOINTMENT_CLOSED");
   if(rescheduling||input.expectedStartsAt!==undefined||input.expectedStatus!==undefined){
    invariant(input.expectedStartsAt===existing.startsAt&&input.expectedStatus===existing.status,"This appointment changed while you were working. Close this form and reopen the latest appointment.",409,"APPOINTMENT_CHANGED");
   }
  }
  if(status==="confirmed"){
   const start=Date.parse(startsAt),end=start+durationMinutes*60000;
   invariant(!state.appointments.some(row=>row.id!==id&&row.status==="confirmed"&&Date.parse(row.startsAt)<end&&Date.parse(row.startsAt)+row.durationMinutes*60000>start),"This time overlaps another confirmed appointment.",409,"BOOKING_CONFLICT");
  }
  const appointment:Appointment={id:existing?.id||randomUUID(),customerId:merged.customerId,name:text(merged.name,120),email:text(merged.email,200)||undefined,phone:text(merged.phone,40)||undefined,service:text(merged.service,100),startsAt:new Date(startsAt).toISOString(),durationMinutes,status,notes:text(merged.notes),createdAt:existing?.createdAt||new Date().toISOString()};
  if(existing)Object.assign(existing,appointment);else state.appointments.push(appointment);
  activity(state,user,`${existing?"Updated":"Created"} appointment for ${appointment.name}`,"appointment");
  return {appointment,emailDelivery:"not_configured"};
 });
}
export async function attendanceAction(input:{action:string;staffId?:string},user:StaffUser){return transaction(state=>{const staffId=input.staffId||user.id;invariant(staffId===user.id||user.role==="super_admin","You can only record your own attendance.",403);invariant(state.staff.some(row=>row.id===staffId&&row.active),"Staff member not found.",404);const date=new Intl.DateTimeFormat("en-CA",{timeZone:state.settings.timezone,year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date()),record=state.attendance.find(row=>row.staffId===staffId&&row.date===date);if(input.action==="clock_in"){invariant(!record,"Already clocked in for today.",409);const attendance={id:randomUUID(),staffId,date,clockIn:new Date().toISOString()};state.attendance.unshift(attendance);return {attendance};}invariant(input.action==="clock_out"&&record&&!record.clockOut,"Clock in before clocking out; completed attendance cannot be overwritten.",409);record.clockOut=new Date().toISOString();return {attendance:record};});}
export async function updateSettings(input:Partial<BusinessSettings>,user:StaffUser){requireOwner(user);return transaction(state=>{for(const key of ["businessName","address","phone","email"] as const)if(input[key]!==undefined){invariant(text(input[key],200),`Enter ${key}.`);state.settings[key]=text(input[key],200);}if(input.timezone!==undefined){const zone=text(input.timezone,80);try{new Intl.DateTimeFormat("en-AU",{timeZone:zone}).format();}catch{invariant(false,"Choose a valid IANA timezone, such as Australia/Melbourne.");}state.settings.timezone=zone;}if(input.labelWidthMm!==undefined){invariant(Number.isFinite(input.labelWidthMm)&&input.labelWidthMm>=30&&input.labelWidthMm<=150,"Label width must be 30–150 mm.");state.settings.labelWidthMm=input.labelWidthMm;}if(input.labelHeightMm!==undefined){invariant(Number.isFinite(input.labelHeightMm)&&input.labelHeightMm>=20&&input.labelHeightMm<=150,"Label height must be 20–150 mm.");state.settings.labelHeightMm=input.labelHeightMm;}activity(state,user,"Updated business settings","settings");return {settings:state.settings};});}
export async function saveStaff(input:Partial<StaffUser>,user:StaffUser,id?:string){requireOwner(user);return transaction(state=>{const existing=id?state.staff.find(row=>row.id===id):undefined;invariant(!id||existing,"Staff member not found.",404);const merged={...existing,...input};invariant(text(merged.name,120)&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(merged.email||""),"Enter the staff member's name and email.");invariant(merged.role==="super_admin"||merged.role==="admin","Choose a valid role.");invariant(["AU","IN","ALL"].includes(merged.team||""),"Choose Australia, India or all teams.");invariant(!state.staff.some(row=>row.id!==id&&row.email.toLowerCase()===merged.email?.toLowerCase()),"That email already has staff access.",409);invariant(id!==user.id||merged.active!==false&&merged.role==="super_admin","Keep your own Super Admin account active.",409);const staff:StaffUser={id:existing?.id||randomUUID(),name:text(merged.name,120),email:text(merged.email,200).toLowerCase(),role:merged.role,team:merged.role==="super_admin"?"ALL":merged.team!,active:merged.active!==false};if(existing)Object.assign(existing,staff);else state.staff.push(staff);if(!staff.active)state.sessions=state.sessions.filter(session=>session.userId!==staff.id);activity(state,user,`${existing?"Updated":"Added"} staff access for ${staff.name}`,"staff");return {staff,accountProvisioning:existing?"unchanged":"provider_signup_required",emailDelivery:"not_configured"};});}
export async function receiveShipment(id:string,user:StaffUser){return transaction(state=>{const shipment=state.shipments.find(row=>row.id===id);invariant(shipment,"Shipment not found.",404);invariant(user.role==="super_admin"||user.team==="ALL"||user.team===(shipment.direction==="AU_TO_IN"?"IN":"AU"),"This receipt belongs to the other team.",403);invariant(shipment.status==="in_transit","Shipment is already received.",409);const items=state.items.filter(item=>shipment.itemIds.includes(item.id));invariant(items.length===shipment.itemIds.length,"A shipment item is missing.",409);for(const item of items){invariant(!item.hold,"Resolve item holds before receiving this shipment.",409,"ON_HOLD");invariant(!item.pendingMeasurementRevisionId,"Accept pending measurement revisions before receiving this shipment.",409,"REVISION_PENDING");invariant(item.stage===(shipment.direction==="IN_TO_AU"?"shipping":"received_india"),"An item is no longer at the expected shipment stage.",409,"STAGE_CONFLICT");}shipment.status="received";shipment.receivedAt=new Date().toISOString();for(const item of items){const fromStage=item.stage;if(shipment.direction==="IN_TO_AU"){item.stage="received_australia";item.team="AU";}item.version++;item.updatedAt=new Date().toISOString();state.activity.unshift({id:randomUUID(),actorId:user.id,actorName:user.name,type:"shipment_receipt",message:`Physical receipt: ${shipment.trackingNumber}`,orderId:item.orderId,itemId:item.id,fromStage,toStage:item.stage,createdAt:shipment.receivedAt});}return {shipment};});}
