import {randomUUID} from "node:crypto";
import {assertSameOrigin,requireSession} from "@/lib/server/auth";
import {putAttachment} from "@/lib/server/storage";
import {transaction} from "@/lib/server/store";
import {errorResponse,invariant} from "@/lib/server/errors";
export const runtime="nodejs";
export async function POST(request:Request){try{assertSameOrigin(request);const {user}=await requireSession(),body=await request.formData(),file=body.get("file");invariant(file instanceof File,"Choose a file.");invariant(file.size>0&&file.size<=10*1024*1024,"Files must be no larger than 10 MB.",413);invariant(["application/pdf","image/jpeg","image/png","image/webp","text/plain"].includes(file.type),"Upload a PDF, JPG, PNG, WebP or text document.");const id=randomUUID(),attachment={id,name:file.name.replace(/[\r\n\/\\]/g,"_").slice(0,160),mimeType:file.type,size:file.size,url:`/api/admin/attachments/${id}`,createdAt:new Date().toISOString()};await putAttachment(id,Buffer.from(await file.arrayBuffer()),file.type);await transaction(state=>{state.uploads.push({...attachment,ownerId:user.id});});return Response.json({attachment},{status:201});}catch(error){return errorResponse(error);}}
