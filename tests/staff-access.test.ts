import assert from "node:assert/strict";
import {randomUUID} from "node:crypto";
import test from "node:test";
import type {AdminState} from "../src/lib/types";

const origin=process.env.DARZI_TEST_ORIGIN||"http://localhost:3000";
async function api(path:string,cookie="",method="GET",body?:unknown){
 const response=await fetch(origin+path,{method,headers:{Origin:origin,...(cookie?{Cookie:cookie}:{}),...(body!==undefined?{"Content-Type":"application/json"}:{})},body:body===undefined?undefined:JSON.stringify(body)});
 return {status:response.status,body:await response.json(),cookies:response.headers.getSetCookie(),cacheControl:response.headers.get("cache-control")};
}
async function developmentLogin(email:string){
 const result=await api("/api/session","","POST",{email,password:"DarziPreview2026!"});
 assert.equal(result.status,200,result.body.error);
 assert.equal(result.body.session.demoData,true,"Staff integration writes require the explicitly synthetic development dataset.");
 return result.cookies.map(cookie=>cookie.split(";")[0]).join("; ");
}

test("private staff invitation guards without creating any managed account",{timeout:120000},async t=>{
 const [owner,india]=await Promise.all([developmentLogin("owner@darzi.test"),developmentLogin("workshop@darzi.test")]);
 const email=`staff-guards-${randomUUID()}@example.test`;
 let id="",firstToken="";
 await t.test("staff creation stays pending even when active access is requested",async()=>{
  const result=await api("/api/admin/staff",owner,"POST",{name:"Synthetic activation guard",email,role:"admin",team:"IN",active:true});
  assert.equal(result.status,200,result.body.error);id=result.body.staff.id;
  assert.equal(result.body.staff.active,false);assert.equal(result.body.staff.activationPending,true);assert.equal(result.body.staff.authUserId,undefined);
  assert.equal(result.body.accountProvisioning,"private_activation_required");
  assert.equal((await api("/api/session","","POST",{email,password:"NeverCreatesAnAccount2026!"})).status,403);
 });
 await t.test("only the owner can issue an expiring setup link, with hash metadata excluded",async()=>{
  assert.equal((await api(`/api/admin/staff/${id}/invite`,india,"POST")).status,403);
  assert.equal((await api(`/api/admin/staff/${id}/invite`,"","POST")).status,401);
  const result=await api(`/api/admin/staff/${id}/invite`,owner,"POST");assert.equal(result.status,200,result.body.error);
  const url=new URL(result.body.setupPath,origin);firstToken=new URLSearchParams(url.hash.slice(1)).get("invite")!;
  assert.ok(/^[A-Za-z0-9_-]{43}$/.test(firstToken),"Private setup token uses the expected random format.");assert.equal(url.searchParams.get("activate"),email);
  assert.ok(Date.parse(result.body.expiresAt)>Date.now());assert.ok(result.cacheControl?.includes("no-store"));
  assert.equal(result.body.staff.activationInvite,undefined);
  const state=(await api("/api/admin/state",owner)).body as AdminState;
  assert.equal((state.staff.find(row=>row.id===id) as unknown as {activationInvite?:unknown}).activationInvite,undefined);
 });
 await t.test("reissuing rotates the secret and direct identity injection is rejected",async()=>{
  const result=await api(`/api/admin/staff/${id}/invite`,owner,"POST");assert.equal(result.status,200);
  const replacement=new URLSearchParams(new URL(result.body.setupPath,origin).hash.slice(1)).get("invite");assert.ok(replacement!==firstToken,"Reissue replaces the previous secret.");
  assert.equal((await api(`/api/admin/staff/${id}`,owner,"PATCH",{authUserId:"attacker-id",active:true})).status,403);
  const pending=await api(`/api/admin/staff/${id}`,owner,"PATCH",{active:true});assert.equal(pending.status,200);assert.equal(pending.body.staff.active,false);
 });
 await t.test("rotated or invalid private links fail before provider signup",async()=>{
  for(const token of [firstToken,"x".repeat(43)]){
   const result=await api("/api/staff-setup","","POST",{email,token,name:"Synthetic guard",password:"NeverCreatesAnAccount2026!"});
   assert.equal(result.status,403);assert.equal(result.body.code,"INVITE_INVALID");assert.equal(result.cookies.length,0);
  }
  assert.equal((await api("/api/auth/sign-up/email","","POST",{email,password:"NeverCreatesAnAccount2026!",name:"Synthetic guard"})).status,403);
 });
 await t.test("explicit revocation invalidates a pending setup link",async()=>{
  const issued=await api(`/api/admin/staff/${id}/invite`,owner,"POST");assert.equal(issued.status,200);
  const token=new URLSearchParams(new URL(issued.body.setupPath,origin).hash.slice(1)).get("invite");
  const revoked=await api(`/api/admin/staff/${id}/invite`,owner,"DELETE");assert.equal(revoked.status,200);assert.equal(revoked.body.staff.active,false);
  const result=await api("/api/staff-setup","","POST",{email,token,name:"Synthetic guard",password:"NeverCreatesAnAccount2026!"});
  assert.equal(result.status,403);assert.equal(result.body.code,"INVITE_INVALID");assert.equal(result.cookies.length,0);
 });
 await t.test("changing a pending email revokes its outstanding invitation",async()=>{
  const issued=await api(`/api/admin/staff/${id}/invite`,owner,"POST");assert.equal(issued.status,200);
  const token=new URLSearchParams(new URL(issued.body.setupPath,origin).hash.slice(1)).get("invite");
  const replacementEmail=`revoked-${randomUUID()}@example.test`;
  const updated=await api(`/api/admin/staff/${id}`,owner,"PATCH",{email:replacementEmail,active:false});assert.equal(updated.status,200);
  assert.equal(updated.body.staff.active,false);assert.equal(updated.body.staff.activationPending,true);
  const state=(await api("/api/admin/state",owner)).body as AdminState;
  assert.equal(state.staff.find(row=>row.id===id)?.authUserId,undefined);
  for(const attemptedEmail of [email,replacementEmail])assert.equal((await api("/api/staff-setup","","POST",{email:attemptedEmail,token,name:"Synthetic guard",password:"NeverCreatesAnAccount2026!"})).status,403);
 });
});
