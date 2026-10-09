import {assertSameOrigin,getSession,signIn,signOut} from "@/lib/server/auth";
import {errorResponse,invariant} from "@/lib/server/errors";
import {localPreviewEnabled} from "@/lib/server/store";
export const runtime="nodejs";
export async function GET(){try{return Response.json({session:await getSession(),mode:process.env.NEON_AUTH_BASE_URL?"neon":localPreviewEnabled()?"local_preview":"unconfigured",preview:process.env.DARZI_DEMO_DATA==="true"||localPreviewEnabled()});}catch(error){return errorResponse(error);}}
export async function POST(request:Request){try{assertSameOrigin(request);const body=await request.json();invariant(typeof body.email==="string"&&typeof body.password==="string"&&body.password.length<=256,"Enter an email and password.");return Response.json({session:await signIn(body.email.trim(),body.password)});}catch(error){return errorResponse(error);}}
export async function DELETE(request:Request){try{assertSameOrigin(request);await signOut();return Response.json({ok:true});}catch(error){return errorResponse(error);}}
