import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import test from "node:test";
import {legacyDemoIdentityAllowed,managedIdentityMatches} from "../src/lib/staff-identity";
import {activationInviteValid,staffInviteValid} from "../src/lib/owner-invite";
import {publicUser,type StoredStaffUser} from "../src/lib/server/model";

const staff:StoredStaffUser={id:"staff-synthetic",name:"Synthetic Staff",email:"staff@example.test",role:"admin",team:"IN",active:true,authUserId:"provider-original"};
const identity={id:"provider-original",email:"STAFF@example.test"};
const now=Date.parse("2026-10-09T12:00:00Z"),token="a".repeat(43),replacement="b".repeat(43);
const invite={email:staff.email,hash:createHash("sha256").update(token).digest("hex"),expiresAt:"2026-10-10T12:00:00Z"};
const pending:StoredStaffUser={...staff,active:false,authUserId:undefined,activationPending:true,activationInvite:invite};

test("managed access requires the exact immutable provider identity and staff email",()=>{
 assert.equal(managedIdentityMatches(staff,identity),true);
 assert.equal(managedIdentityMatches(staff,{...identity,id:"provider-recreated"}),false);
 assert.equal(managedIdentityMatches(staff,{...identity,email:"other@example.test"}),false);
 assert.equal(managedIdentityMatches({...staff,active:false},identity),false);
 assert.equal(managedIdentityMatches(undefined,identity),false);
});
test("an unbound allow-listed email or pending activation cannot grant production access",()=>{
 assert.equal(managedIdentityMatches({...staff,authUserId:undefined},identity),false);
 assert.equal(managedIdentityMatches(pending,identity),false);
 assert.equal(managedIdentityMatches({...staff,authUserId:"provider-original"},{...identity,id:""}),false);
});
test("legacy synthetic identities are permitted only on the explicit isolated development branch",()=>{
 const development={DARZI_DEMO_DATA:"true",NEON_PROJECT_ID:"icy-grass-38018123",NEON_BRANCH_ID:"br-billowing-flower-b3bfld8x"};
 assert.equal(legacyDemoIdentityAllowed(development),true);
 for(const env of [{...development,DARZI_DEMO_DATA:"false"},{...development,NEON_PROJECT_ID:"different"},{...development,NEON_BRANCH_ID:"br-frosty-recipe-b39v7qnl"},{}])assert.equal(legacyDemoIdentityAllowed(env),false);
 assert.equal(managedIdentityMatches({...staff,authUserId:undefined},identity,true),true);
 assert.equal(managedIdentityMatches(staff,{...identity,id:"wrong"},true),false,"An existing binding is never bypassed by demo compatibility.");
});
test("private staff activation is bound to pending state, email, token hash and expiry",()=>{
 assert.equal(staffInviteValid(pending,staff.email,token,now),true);
 assert.equal(staffInviteValid(pending,"other@example.test",token,now),false);
 assert.equal(staffInviteValid(pending,staff.email,replacement,now),false);
 assert.equal(staffInviteValid(pending,staff.email,token,Date.parse(invite.expiresAt)),false);
 assert.equal(staffInviteValid({...pending,active:true},staff.email,token,now),false);
 assert.equal(staffInviteValid({...pending,activationPending:false},staff.email,token,now),false);
 assert.equal(staffInviteValid({...pending,authUserId:identity.id},staff.email,token,now),false);
});
test("consumption or rotation invalidates the previous activation link",()=>{
 assert.equal(staffInviteValid({...pending,activationInvite:undefined},staff.email,token,now),false);
 const rotated={...pending,activationInvite:{...invite,hash:createHash("sha256").update(replacement).digest("hex")}};
 assert.equal(staffInviteValid(rotated,staff.email,token,now),false);
 assert.equal(staffInviteValid(rotated,staff.email,replacement,now),true);
 for(const value of [undefined,null,{}, {...invite,hash:"bad"},{...invite,expiresAt:"never"}]) assert.equal(activationInviteValid(staff.email,token,value,now),false);
});
test("public staff serialization never exposes activation hashes or internal metadata",()=>{
 const result=publicUser(pending);
 assert.equal(result.activationPending,true);
 assert.equal(result.active,false);
 assert.ok(!JSON.stringify(result).includes(invite.hash));
 assert.ok(!("activationInvite" in result));
 assert.equal(publicUser(staff).authUserId,identity.id);
 assert.equal(publicUser({...staff,authUserId:undefined}).activationPending,true);
 assert.equal(publicUser({...staff,authUserId:undefined}).active,false);
 assert.equal(publicUser({...staff,authUserId:undefined},true).active,true);
 assert.equal(publicUser(pending,true).active,false,"New pending demo records still require their private activation link.");
});
