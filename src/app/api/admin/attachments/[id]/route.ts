import {requireSession} from "@/lib/server/auth";
import {getAttachment} from "@/lib/server/storage";
import {readState} from "@/lib/server/store";
import {canReadItem} from "@/lib/server/workspace";
import {errorResponse,invariant} from "@/lib/server/errors";
export const runtime="nodejs";
export async function GET(request:Request,context:{params:Promise<{id:string}>}){try{const {user}=await requireSession(),{id}=await context.params;invariant(/^[\da-f-]{36}$/.test(id),"Attachment not found.",404);const state=await readState(),file=state.uploads.find(upload=>upload.id===id);invariant(file,"Attachment not found.",404);const referenced=state.items.some(item=>canReadItem(user,item)&&(item.attachments.some(attachment=>attachment.id===id)||item.measurements.some(revision=>revision.source?.id===id)));invariant(user.role==="super_admin"||file.ownerId===user.id||referenced,"You do not have access to this attachment.",403,"ACCESS_DENIED");const bytes=await getAttachment(id);return new Response(bytes as BodyInit,{headers:{"Content-Type":file.mimeType,"Content-Disposition":`inline; filename*=UTF-8''${encodeURIComponent(file.name)}`,"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});}catch(error){return errorResponse(error);}}
