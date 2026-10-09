import {assertSameOrigin,requireSession} from "@/lib/server/auth";
import {attendanceAction} from "@/lib/server/operations";
import {errorResponse} from "@/lib/server/errors";
export const runtime="nodejs";
export async function POST(request:Request){try{assertSameOrigin(request);const {user}=await requireSession();return Response.json(await attendanceAction(await request.json(),user));}catch(error){return errorResponse(error);}}
