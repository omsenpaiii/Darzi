import test from "node:test";
import assert from "node:assert/strict";
import {randomUUID} from "node:crypto";
import type {AdminState,Appointment} from "../src/lib/types";

const origin=process.env.DARZI_TEST_ORIGIN||"http://localhost:3000";
type Reply<T=Record<string,any>>={status:number;body:T;cookies:string[]};
async function api<T=Record<string,any>>(path:string,cookie="",method="GET",body?:unknown):Promise<Reply<T>>{
 const headers:Record<string,string>={Origin:origin};
 if(cookie)headers.Cookie=cookie;
 if(body!==undefined)headers["Content-Type"]="application/json";
 const response=await fetch(origin+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
 return {status:response.status,body:await response.json() as T,cookies:response.headers.getSetCookie()};
}
async function login(email:string){
 const result=await api("/api/session","","POST",{email,password:"DarziPreview2026!"});
 assert.equal(result.status,200,result.body.error);
 assert.equal(result.body.session.demoData,true,"Mutating appointment tests require an explicitly labelled development dataset.");
 return result.cookies.map(cookie=>cookie.split(";")[0]).join("; ");
}
const expected=(appointment:Appointment)=>({expectedStartsAt:appointment.startsAt,expectedStatus:appointment.status});
const edit=(appointment:Appointment,startsAt=appointment.startsAt)=>({name:appointment.name,service:appointment.service,startsAt,durationMinutes:appointment.durationMinutes,notes:appointment.notes,status:"confirmed",...expected(appointment)});

test("synthetic appointment rescheduling preserves identity, checks overlap and rejects stale or closed edits",{timeout:120000},async t=>{
 const [au,india]=await Promise.all([login("melbourne@darzi.test"),login("workshop@darzi.test")]);
 const state=await api<AdminState>("/api/admin/state",au);assert.equal(state.status,200);
 assert.equal(state.body.session.demoData,true,"Synthetic appointments must never be written to a live dataset.");
 const run=randomUUID(),createdIds:string[]=[];
 let base=Date.UTC(2045,0,1,9)+parseInt(run.slice(0,8),16)%365*86400000;
 while(state.body.appointments.some(row=>row.status==="confirmed"&&Date.parse(row.startsAt)<base+4*3600000&&Date.parse(row.startsAt)+row.durationMinutes*60000>base))base+=86400000;
 const at=(minutes:number)=>new Date(base+minutes*60000).toISOString();
 const input={name:`Synthetic appointment QA ${run}`,service:"Consultation",startsAt:at(0),durationMinutes:45,status:"confirmed",notes:"Synthetic development test appointment."};
 let first:Appointment,second:Appointment;
 try{
  await t.test("India cannot create studio appointments",async()=>{
   const denied=await api("/api/admin/appointments",india,"POST",input);assert.equal(denied.status,403);
  });
  await t.test("creation and an unchanged reschedule retain the record and exact instant",async()=>{
   const created=await api("/api/admin/appointments",au,"POST",input);assert.equal(created.status,200,created.body.error);
   first=created.body.appointment;createdIds.push(first.id);
   const unchanged=await api(`/api/admin/appointments/${first.id}`,au,"PATCH",edit(first));assert.equal(unchanged.status,200,unchanged.body.error);
   assert.equal(unchanged.body.appointment.startsAt,first.startsAt);assert.equal(unchanged.body.appointment.id,first.id);assert.equal(unchanged.body.appointment.createdAt,first.createdAt);
   first=unchanged.body.appointment;
   const createdSecond=await api("/api/admin/appointments",au,"POST",{...input,name:`Synthetic adjacent QA ${run}`,startsAt:at(60)});assert.equal(createdSecond.status,200,createdSecond.body.error);
   second=createdSecond.body.appointment;createdIds.push(second.id);
  });
  await t.test("overlapping reschedules fail, adjacent slots succeed and stale forms fail",async()=>{
   const overlapping=await api(`/api/admin/appointments/${first.id}`,au,"PATCH",edit(first,at(75)));assert.equal(overlapping.status,409);assert.equal(overlapping.body.code,"BOOKING_CONFLICT");
   const missingSnapshot=await api(`/api/admin/appointments/${first.id}`,au,"PATCH",{startsAt:at(15),status:"confirmed"});assert.equal(missingSnapshot.status,409);assert.equal(missingSnapshot.body.code,"APPOINTMENT_CHANGED");
   const old=first;
   const adjacent=await api(`/api/admin/appointments/${first.id}`,au,"PATCH",edit(first,at(15)));assert.equal(adjacent.status,200,adjacent.body.error);first=adjacent.body.appointment;
   assert.equal(first.startsAt,at(15));assert.equal(first.id,old.id);
   const staleEdit=await api(`/api/admin/appointments/${first.id}`,au,"PATCH",edit(old,at(120)));assert.equal(staleEdit.status,409);assert.equal(staleEdit.body.code,"APPOINTMENT_CHANGED");
   const staleCompletion=await api(`/api/admin/appointments/${first.id}`,au,"PATCH",{status:"completed",...expected(old)});assert.equal(staleCompletion.status,409);assert.equal(staleCompletion.body.code,"APPOINTMENT_CHANGED");
  });
  await t.test("cancellation cannot be undone by a stale reschedule or reconfirmation",async()=>{
   const old=second;
   const cancelled=await api(`/api/admin/appointments/${second.id}`,au,"PATCH",{status:"cancelled",...expected(second)});assert.equal(cancelled.status,200,cancelled.body.error);second=cancelled.body.appointment;
   const stale=await api(`/api/admin/appointments/${second.id}`,au,"PATCH",edit(old,at(120)));assert.equal(stale.status,409);assert.equal(stale.body.code,"APPOINTMENT_CLOSED");
   const reconfirm=await api(`/api/admin/appointments/${second.id}`,au,"PATCH",{status:"confirmed"});assert.equal(reconfirm.status,409);assert.equal(reconfirm.body.code,"APPOINTMENT_CLOSED");
  });
  await t.test("completion cannot be undone by a stale reschedule or reconfirmation",async()=>{
   const old=first;
   const completed=await api(`/api/admin/appointments/${first.id}`,au,"PATCH",{status:"completed",...expected(first)});assert.equal(completed.status,200,completed.body.error);first=completed.body.appointment;
   const stale=await api(`/api/admin/appointments/${first.id}`,au,"PATCH",edit(old,at(120)));assert.equal(stale.status,409);assert.equal(stale.body.code,"APPOINTMENT_CLOSED");
   const reconfirm=await api(`/api/admin/appointments/${first.id}`,au,"PATCH",{status:"confirmed"});assert.equal(reconfirm.status,409);assert.equal(reconfirm.body.code,"APPOINTMENT_CLOSED");
   const after=await api<AdminState>("/api/admin/state",au);assert.equal(after.status,200);
   assert.equal(after.body.appointments.find(row=>row.id===first.id)?.status,"completed");assert.equal(after.body.appointments.find(row=>row.id===first.id)?.startsAt,at(15));
   assert.equal(after.body.appointments.find(row=>row.id===second.id)?.status,"cancelled");assert.equal(after.body.appointments.find(row=>row.id===second.id)?.startsAt,at(60));
  });
 }finally{
  if(createdIds.length){
   const latest=await api<AdminState>("/api/admin/state",au);assert.equal(latest.status,200);
   for(const appointment of latest.body.appointments.filter(row=>createdIds.includes(row.id)&&["requested","confirmed"].includes(row.status))){
    const cleanup=await api(`/api/admin/appointments/${appointment.id}`,au,"PATCH",{status:"cancelled",...expected(appointment)});assert.equal(cleanup.status,200,cleanup.body.error);
   }
  }
 }
});
