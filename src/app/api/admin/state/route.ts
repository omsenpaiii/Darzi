import {requireSession} from "@/lib/server/auth";
import {adminState} from "@/lib/server/workspace";
import {errorResponse} from "@/lib/server/errors";
export const runtime="nodejs";
export async function GET(){try{return Response.json(await adminState(await requireSession()));}catch(error){return errorResponse(error);}}
