import {assertSameOrigin,requireSession} from "@/lib/server/auth";
import {issueStaffActivation,revokeStaffActivation} from "@/lib/server/operations";
import {errorResponse} from "@/lib/server/errors";
export const runtime="nodejs";
export async function POST(request:Request,context:{params:Promise<{id:string}>}){try{assertSameOrigin(request);const {user}=await requireSession(),{id}=await context.params;return Response.json(await issueStaffActivation(id,user),{headers:{"Cache-Control":"private, no-store"}});}catch(error){return errorResponse(error);}}
export async function DELETE(request:Request,context:{params:Promise<{id:string}>}){try{assertSameOrigin(request);const {user}=await requireSession(),{id}=await context.params;return Response.json(await revokeStaffActivation(id,user));}catch(error){return errorResponse(error);}}
