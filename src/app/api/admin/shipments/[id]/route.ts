import {assertSameOrigin,requireSession} from "@/lib/server/auth";
import {receiveShipment} from "@/lib/server/operations";
import {errorResponse} from "@/lib/server/errors";
export const runtime="nodejs";
export async function PATCH(request:Request,context:{params:Promise<{id:string}>}){try{assertSameOrigin(request);const {user}=await requireSession(),{id}=await context.params;return Response.json(await receiveShipment(id,user));}catch(error){return errorResponse(error);}}
