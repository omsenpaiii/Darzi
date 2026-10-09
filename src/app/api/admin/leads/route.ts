import {requireSession,assertSameOrigin} from "@/lib/server/auth";
import {createLead} from "@/lib/server/workspace";
import {errorResponse} from "@/lib/server/errors";
export const runtime="nodejs";
export async function POST(request:Request){try{assertSameOrigin(request);const {user}=await requireSession();return Response.json(await createLead(await request.json(),user),{status:201});}catch(error){return errorResponse(error);}}
