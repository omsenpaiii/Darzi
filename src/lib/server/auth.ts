import "server-only";
import {cookies} from "next/headers";
import {randomBytes} from "node:crypto";
import {createNeonAuth} from "@neondatabase/auth/next/server";
import type {Session,StaffUser} from "@/lib/types";
import {readState,transaction,localPreviewEnabled} from "./store";
import {checkPassword,tokenHash} from "./password";
import {ApiFailure,invariant} from "./errors";
import {legacyDemoIdentityAllowed,managedIdentityMatches} from "@/lib/staff-identity";
import {publicUser} from "./model";
import {authFailureStatus} from "@/lib/auth-provider-errors";
import {managedAuthCookieNames,MANAGED_AUTH_COOKIE_EXPIRY} from "@/lib/managed-auth-cookies";
const COOKIE="darzi_session";
let managedAuth:ReturnType<typeof createNeonAuth>|undefined;
export function neonAuth(){invariant(process.env.NEON_AUTH_BASE_URL&&process.env.NEON_AUTH_COOKIE_SECRET,"Managed authentication is not configured.",503,"SETUP_REQUIRED");return managedAuth??=createNeonAuth({baseUrl:process.env.NEON_AUTH_BASE_URL,cookies:{secret:process.env.NEON_AUTH_COOKIE_SECRET}});}
export function assertSameOrigin(request:Request){const origin=request.headers.get("origin"),url=new URL(request.url),host=request.headers.get("host")||url.host;const protocol=request.headers.get("x-forwarded-proto")?.split(",")[0]||url.protocol.replace(":","");const expected=`${protocol}://${host}`;const allowed=[url.origin,expected,process.env.DARZI_APP_ORIGIN,process.env.NEXT_PUBLIC_SITE_URL].filter(Boolean);invariant(!origin||allowed.includes(origin),"Cross-site requests are not allowed.",403,"ORIGIN_DENIED");invariant(request.headers.get("sec-fetch-site")!=="cross-site","Cross-site requests are not allowed.",403,"ORIGIN_DENIED");}
export async function getSession():Promise<Session|null>{
 if(process.env.NEON_AUTH_BASE_URL){const result=await neonAuth().getSession(),failureStatus=authFailureStatus(result.error);if(result.error&&failureStatus!==401)throw new ApiFailure(failureStatus,result.error.message||"Authentication is temporarily unavailable.",failureStatus===429?"AUTH_RATE_LIMITED":"AUTH_PROVIDER_UNAVAILABLE");const session=result.data;if(!session?.user)return null;return transaction(state=>{const user=state.staff.find(u=>u.email.toLowerCase()===session.user.email.toLowerCase());invariant(managedIdentityMatches(user,session.user,legacyDemoIdentityAllowed(process.env)),"This account has no active staff access. Use your private activation link if setup is pending.",403,"ACCESS_DENIED");return {user:publicUser(user!,legacyDemoIdentityAllowed(process.env)),mode:"neon",demoData:process.env.DARZI_DEMO_DATA==="true"};});}
 if(!localPreviewEnabled())return null;
 const token=(await cookies()).get(COOKIE)?.value;if(!token)return null;const state=await readState();const session=state.sessions.find(s=>s.id===tokenHash(token)&&new Date(s.expiresAt).getTime()>Date.now());if(!session)return null;const user=state.staff.find(u=>u.id===session.userId&&u.active);return user?{user:publicUser(user,true),mode:"local_preview",expiresAt:session.expiresAt,demoData:true}:null;
}
export async function requireSession():Promise<Session>{const session=await getSession();if(!session)throw new ApiFailure(401,"Sign in to continue.","UNAUTHORIZED");return session;}
export function requireOwner(user:StaffUser){invariant(user.role==="super_admin","Super Admin access is required.",403,"ACCESS_DENIED");}
export function requireAustralia(user:StaffUser){invariant(user.role==="super_admin"||user.team==="AU"||user.team==="ALL","Australia customer-service access is required.",403,"ACCESS_DENIED");}
export async function localSignIn(email:string,password:string):Promise<Session>{invariant(localPreviewEnabled()&&!process.env.NEON_AUTH_BASE_URL,"Use the configured managed sign-in flow.",503,"MANAGED_AUTH_REQUIRED");const raw=randomBytes(32).toString("base64url"),expiresAt=new Date(Date.now()+12*3600000).toISOString();const session=await transaction(state=>{const user=state.staff.find(u=>u.email.toLowerCase()===email.toLowerCase()&&u.active),credential=user&&state.credentials.find(c=>c.userId===user.id);invariant(user&&credential&&checkPassword(password,credential.passwordHash),"Email or password is incorrect.",401,"INVALID_CREDENTIALS");state.sessions=state.sessions.filter(s=>new Date(s.expiresAt).getTime()>Date.now());state.sessions.push({id:tokenHash(raw),userId:user.id,expiresAt});return {user:publicUser(user,true),mode:"local_preview" as const,expiresAt};});(await cookies()).set(COOKIE,raw,{httpOnly:true,sameSite:"strict",secure:process.env.NODE_ENV==="production",path:"/",maxAge:12*3600});return session;}
export async function signIn(email:string,password:string):Promise<Session>{if(!process.env.NEON_AUTH_BASE_URL)return localSignIn(email,password);const state=await readState();const allowed=state.staff.find(user=>user.email.toLowerCase()===email.toLowerCase()&&user.active),legacy=legacyDemoIdentityAllowed(process.env);invariant(allowed&&(allowed.authUserId||legacy),"This account has no active staff access. Use your private activation link if setup is pending.",403,"ACCESS_DENIED");const result=await neonAuth().signIn.email({email,password});const failureStatus=authFailureStatus(result.error);invariant(!result.error,result.error?.message||"Email or password is incorrect.",failureStatus,failureStatus===429?"AUTH_RATE_LIMITED":failureStatus>=500?"AUTH_PROVIDER_UNAVAILABLE":"INVALID_CREDENTIALS");invariant(result.data?.user&&managedIdentityMatches(allowed,result.data.user,legacy),"The authentication provider could not verify this staff identity.",403,"ACCESS_DENIED");return {user:publicUser(allowed,legacy),mode:"neon",demoData:process.env.DARZI_DEMO_DATA==="true"};}
export async function signOut(){
 const cookieStore=await cookies(),token=cookieStore.get(COOKIE)?.value;
 const managedCookies=managedAuthCookieNames(cookieStore.getAll().map(cookie=>cookie.name));
 try{
  if(token&&localPreviewEnabled())await transaction(state=>{state.sessions=state.sessions.filter(s=>s.id!==tokenHash(token));});
  if(process.env.NEON_AUTH_BASE_URL){const result=await neonAuth().signOut(),failureStatus=authFailureStatus(result.error);if(result.error&&failureStatus!==401)throw new ApiFailure(failureStatus,result.error.message||"The authentication provider could not revoke this session.",failureStatus===429?"AUTH_RATE_LIMITED":"AUTH_PROVIDER_UNAVAILABLE");}
 }finally{
  cookieStore.delete(COOKIE);
  for(const name of managedCookies)cookieStore.set(name,"",MANAGED_AUTH_COOKIE_EXPIRY);
 }
}
