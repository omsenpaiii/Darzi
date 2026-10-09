import {requireSession} from "@/lib/server/auth";
import {resolveQr} from "@/lib/server/workspace";
import {errorResponse,invariant} from "@/lib/server/errors";
export const runtime="nodejs";
export async function GET(request:Request){try{const {user}=await requireSession(),code=new URL(request.url).searchParams.get("code");invariant(code,"Enter a label code.");return Response.json(await resolveQr(code,user));}catch(error){return errorResponse(error);}}
