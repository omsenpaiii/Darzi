import {neonAuth} from "@/lib/server/auth";
import {errorResponse,invariant} from "@/lib/server/errors";
export const runtime="nodejs";
async function handle(request:Request,context:{params:Promise<{path:string[]}>}){try{const {path}=await context.params;invariant(!path.some(segment=>["sign-up","create-user"].includes(segment)),"Use your private staff setup link to create an account.",403,"SIGNUP_DISABLED");const handlers=neonAuth().handler();const method=request.method as keyof typeof handlers;const handler=handlers[method];return handler?await handler(request,context):new Response(null,{status:405});}catch(error){return errorResponse(error);}}
export const GET=handle,POST=handle,PUT=handle,DELETE=handle,PATCH=handle;
