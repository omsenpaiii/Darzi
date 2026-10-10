import {assertSameOrigin,neonAuth} from "@/lib/server/auth";
import {errorResponse,invariant} from "@/lib/server/errors";
import {readState,transaction} from "@/lib/server/store";
import {publicUser} from "@/lib/server/model";
import {staffInviteValid} from "@/lib/owner-invite";
import {authFailureStatus,isDuplicateAuthAccount} from "@/lib/auth-provider-errors";
export const runtime="nodejs";

export async function POST(request:Request){
 try{
  assertSameOrigin(request);
  invariant(process.env.NEON_AUTH_BASE_URL,"Managed account setup is unavailable.",503);
  const text=await request.text();invariant(text.length<=8192,"The setup request is too large.",413);
  let body;try{body=JSON.parse(text);}catch{invariant(false,"Complete the account details.");}
  invariant(body&&typeof body==="object"&&!Array.isArray(body)&&typeof body.email==="string"&&typeof body.token==="string"&&typeof body.password==="string"&&typeof body.name==="string","Complete the account details.");
  const email=body.email.trim().toLowerCase(),name=body.name.trim();
  const pending=(await readState()).staff.find(staff=>staff.email.toLowerCase()===email);
  invariant(pending&&staffInviteValid(pending,email,body.token),"This private setup link is invalid, expired or already used.",403,"INVITE_INVALID");
  invariant(name.length>=2&&name.length<=80&&body.password.length>=12&&body.password.length<=128,"Use your name and a password of 12–128 characters.");
  let result=await neonAuth().signUp.email({email,name,password:body.password});
  if(isDuplicateAuthAccount(result.error))result=await neonAuth().signIn.email({email,password:body.password});
  invariant(!result.error&&result.data?.user?.email.toLowerCase()===email&&typeof result.data.user.id==="string"&&result.data.user.id.length>0,result.error?.message||"Account setup could not be completed.",authFailureStatus(result.error,400),"AUTH_SETUP_FAILED");
  const authUserId=result.data.user.id;
  const user=await transaction(state=>{
   const staff=state.staff.find(row=>row.id===pending.id);
   invariant(staff&&staffInviteValid(staff,email,body.token),"This private setup link is invalid, expired or already used.",403,"INVITE_INVALID");
   invariant(!state.staff.some(row=>row.id!==staff.id&&row.authUserId===authUserId),"This managed account already has workspace access.",409);
   staff.authUserId=authUserId;staff.name=name;staff.active=true;staff.activationPending=false;delete staff.activationInvite;
   state.activity.unshift({id:crypto.randomUUID(),actorId:staff.id,actorName:staff.name,type:"staff_activation",message:`${staff.name} activated their private workspace account`,createdAt:new Date().toISOString()});
   return publicUser(staff);
  });
  return Response.json({session:{user,mode:"neon",demoData:process.env.DARZI_DEMO_DATA==="true"}},{status:201});
 }catch(error){return errorResponse(error);}
}
