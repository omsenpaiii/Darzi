import {randomUUID} from "node:crypto";
import {assertSameOrigin,requireSession} from "@/lib/server/auth";
import {putAttachment} from "@/lib/server/storage";
import {transaction} from "@/lib/server/store";
import {errorResponse,invariant} from "@/lib/server/errors";
import {attachmentError,MAX_ATTACHMENT_BYTES} from "@/lib/attachment-policy";
export const runtime="nodejs";
export async function POST(request:Request){try{assertSameOrigin(request);const {user}=await requireSession(),body=await request.formData(),file=body.get("file");invariant(file instanceof File,"Choose a file.");const validation=attachmentError(file);invariant(!validation,validation,file.size>MAX_ATTACHMENT_BYTES?413:400);const id=randomUUID(),attachment={id,name:file.name.replace(/[\r\n\/\\]/g,"_").slice(0,160),mimeType:file.type,size:file.size,url:`/api/admin/attachments/${id}`,createdAt:new Date().toISOString()};await putAttachment(id,Buffer.from(await file.arrayBuffer()),file.type);await transaction(state=>{state.uploads.push({...attachment,ownerId:user.id});});return Response.json({attachment},{status:201});}catch(error){return errorResponse(error);}}
