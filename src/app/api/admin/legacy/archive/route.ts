import {requireSession} from "@/lib/server/auth";
import {legacyArchive} from "@/lib/server/legacy";
import {errorResponse} from "@/lib/server/errors";
export const runtime="nodejs";
export async function GET(){try{const {user}=await requireSession();return Response.json(await legacyArchive(user));}catch(error){return errorResponse(error);}}
