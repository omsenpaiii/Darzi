import "server-only";
import {S3Client,PutObjectCommand,GetObjectCommand} from "@aws-sdk/client-s3";
import {saveFileBytes,loadFileBytes,localPreviewEnabled} from "./store";
import {invariant} from "./errors";
let client:S3Client|undefined;
function s3(){return client??=new S3Client({forcePathStyle:true,region:process.env.AWS_REGION,endpoint:process.env.AWS_ENDPOINT_URL_S3});}
export async function putAttachment(id:string,bytes:Buffer,mimeType:string){if(process.env.AWS_ENDPOINT_URL_S3&&process.env.DARZI_STORAGE_BUCKET){await s3().send(new PutObjectCommand({Bucket:process.env.DARZI_STORAGE_BUCKET,Key:`jobs/${id}`,Body:bytes,ContentType:mimeType}));return;}await saveFileBytes(id,bytes);}
export async function getAttachment(id:string):Promise<Uint8Array>{if(process.env.AWS_ENDPOINT_URL_S3&&process.env.DARZI_STORAGE_BUCKET){const result=await s3().send(new GetObjectCommand({Bucket:process.env.DARZI_STORAGE_BUCKET,Key:`jobs/${id}`}));invariant(result.Body,"Attachment not found.",404);return result.Body.transformToByteArray();}return loadFileBytes(id);}
