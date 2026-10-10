import assert from "node:assert/strict";
import test from "node:test";
import {authFailureStatus,isDuplicateAuthAccount} from "../src/lib/auth-provider-errors";

test("account recovery recognizes normalized duplicate-account errors only at client-error statuses",()=>{
 for(const code of ["user_already_exists","email_exists","USER_ALREADY_EXISTS","USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"]){
  assert.equal(isDuplicateAuthAccount({code,status:422}),true);
  assert.equal(isDuplicateAuthAccount({code,status:409}),true);
  for(const status of [undefined,401,403,429,500,502])assert.equal(isDuplicateAuthAccount({code,status}),false);
 }
});
test("the SDK's newer 422 duplicate normalization retains a narrow exact-message recovery path",()=>{
 assert.equal(isDuplicateAuthAccount({status:422,code:"validation_failed",message:"User already exists. Use another email."}),true);
 for(const message of ["Invalid password","Complete the email","User already exists","Failed because user already exists. Use another email.","User already exists. Use another email. Network failure"]){
  assert.equal(isDuplicateAuthAccount({status:422,code:"validation_failed",message}),false);
 }
 assert.equal(isDuplicateAuthAccount({status:500,code:"validation_failed",message:"User already exists. Use another email."}),false);
 assert.equal(isDuplicateAuthAccount(null),false);
});
test("provider throttling and service failures retain their HTTP status instead of becoming bad credentials",()=>{
 for(const status of [429,500,502,503,504]){
  assert.equal(authFailureStatus({status}),status);
  assert.equal(authFailureStatus({status},400),status);
 }
});
test("credential and validation errors keep the caller's safe fallback status",()=>{
 for(const status of [undefined,200,400,401,403,422,499,600,502.5,"502"]){
  assert.equal(authFailureStatus({status}),401);
  assert.equal(authFailureStatus({status},400),400);
 }
 assert.equal(authFailureStatus(null),401);
});
