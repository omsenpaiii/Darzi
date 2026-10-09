import {assertSameOrigin,requireSession} from "@/lib/server/auth";
import {importLegacy} from "@/lib/server/legacy";
import {errorResponse,invariant} from "@/lib/server/errors";
export const runtime="nodejs";
export async function POST(request:Request){try{assertSameOrigin(request);const {user}=await requireSession(),raw=await request.text();invariant(raw.length<10*1024*1024,"The export is too large.",413);return Response.json(await importLegacy(JSON.parse(raw),user));}catch(error){return errorResponse(error);}}
