import {assertSameOrigin,requireSession} from "@/lib/server/auth";
import {updateSettings} from "@/lib/server/operations";
import {errorResponse} from "@/lib/server/errors";
export const runtime="nodejs";
export async function PATCH(request:Request){try{assertSameOrigin(request);const {user}=await requireSession();return Response.json(await updateSettings(await request.json(),user));}catch(error){return errorResponse(error);}}
