import type { AdminState, StaffUser, FileAttachment } from "@/lib/types";
export interface StaffCredential { id:string; userId:string; passwordHash:string; }
export interface StoredSession { id:string; userId:string; expiresAt:string; }
export interface StoredUpload extends FileAttachment { ownerId:string; }
export interface PublicRequestRecord { id:string; payloadHash:string; leadId:string; }
export interface SubmissionWindow { id:string; start:number; count:number; }
export interface LegacyRecord {id:string;boardId:string;boardName:string;name:string;stage:string;closed:boolean;importedAt:string;attachmentCount:number;source:Record<string,unknown>;}
export type StoredState = Omit<AdminState,"session"> & {credentials:StaffCredential[];sessions:StoredSession[];uploads:StoredUpload[];requests:PublicRequestRecord[];submissionWindows:SubmissionWindow[];legacyArchive:LegacyRecord[]};
export const COLLECTIONS = ["customers","orders","items","leads","activity","shipments","staff","appointments","attendance","invoices","credentials","sessions","uploads","requests","submissionWindows","legacyArchive"] as const;
export const tableName=(collection:Collection)=>collection.replace(/[A-Z]/g,character=>`_${character.toLowerCase()}`);
export type Collection = typeof COLLECTIONS[number];
export function publicUser(user:StaffUser):StaffUser { return {id:user.id,name:user.name,email:user.email,role:user.role,team:user.team,active:user.active}; }
