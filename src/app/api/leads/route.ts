import {assertSameOrigin} from "@/lib/server/auth";
import {submitPublicLead} from "@/lib/server/public-leads";
import {errorResponse,invariant} from "@/lib/server/errors";
import {text} from "@/lib/server/workspace";
export const runtime="nodejs";
export async function POST(request:Request){try{assertSameOrigin(request);invariant(Number(request.headers.get("content-length")||0)<=20000,"Request is too large.",413);const raw=await request.text();invariant(raw.length<=20000,"Request is too large.",413);let body;try{body=JSON.parse(raw);}catch{invariant(false,"The enquiry could not be read.");}invariant(body&&typeof body==="object","The enquiry could not be read.");invariant(!text(body.website),"The enquiry could not be accepted.",400,"SPAM_REJECTED");const result=await submitPublicLead(body,request.headers.get("idempotency-key")||text(body.idempotencyKey,128)||null,request.headers.get("x-forwarded-for")?.split(",")[0].trim()||request.headers.get("x-real-ip")||"local");return Response.json(result,{status:result.duplicate?200:201});}catch(error){return errorResponse(error);}}
