import assert from "node:assert/strict";
import test from "node:test";
import {managedAuthCookieNames,MANAGED_AUTH_COOKIE_EXPIRY} from "../src/lib/managed-auth-cookies";

test("managed logout clears both the installed SDK's session token and signed local cache",()=>{
 const names=["__Secure-neon-auth.session_token","__Secure-neon-auth.local.session_data","__Secure-neon-auth.session_challenge","__Secure-neon-auth.session_challange"];
 assert.deepEqual(managedAuthCookieNames(names),names);
});
test("managed logout leaves unrelated application and similarly named cookies alone",()=>{
 assert.deepEqual(managedAuthCookieNames(["darzi_session","preferences","__Secure-other.session_token","__Secure-neon-auth-other.session_token","__Secure-neon-auth","neon-auth.session_token"]),[]);
});
test("managed cookie expiration retains Secure and the SDK's root path",()=>{
 assert.equal(MANAGED_AUTH_COOKIE_EXPIRY.secure,true);
 assert.equal(MANAGED_AUTH_COOKIE_EXPIRY.httpOnly,true);
 assert.equal(MANAGED_AUTH_COOKIE_EXPIRY.path,"/");
 assert.equal(MANAGED_AUTH_COOKIE_EXPIRY.maxAge,0);
 assert.equal(MANAGED_AUTH_COOKIE_EXPIRY.expires.getTime(),0);
 assert.equal(MANAGED_AUTH_COOKIE_EXPIRY.sameSite,"lax");
});
