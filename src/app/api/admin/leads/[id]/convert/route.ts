import {requireSession,assertSameOrigin} from "@/lib/server/auth";
import {convertLead} from "@/lib/server/workspace";
import {errorResponse} from "@/lib/server/errors";
export const runtime="nodejs";
export async function POST(request:Request,context:{params:Promise<{id:string}>}){try{assertSameOrigin(request);const {user}=await requireSession(),{id}=await context.params;return Response.json(await convertLead(id,await request.json(),user));}catch(error){return errorResponse(error);}}
