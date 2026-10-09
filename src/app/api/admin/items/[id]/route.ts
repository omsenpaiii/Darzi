import {requireSession,assertSameOrigin} from "@/lib/server/auth";
import {updateItem,resolveQr} from "@/lib/server/workspace";
import {errorResponse} from "@/lib/server/errors";
export const runtime="nodejs";
export async function GET(request:Request,context:{params:Promise<{id:string}>}){try{const {user}=await requireSession(),{id}=await context.params;return Response.json(await resolveQr(id,user));}catch(error){return errorResponse(error);}}
export async function PATCH(request:Request,context:{params:Promise<{id:string}>}){try{assertSameOrigin(request);const {user}=await requireSession(),{id}=await context.params;return Response.json(await updateItem(id,await request.json(),user));}catch(error){return errorResponse(error);}}
