// Leave room for multipart headers below the hosted function's 4.5 MB limit.
export const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024;
export const ATTACHMENT_HINT = 'PDF, JPG, PNG, WebP or text · up to 4 MB per file.';
export const ATTACHMENT_ACCEPT = 'application/pdf,image/jpeg,image/png,image/webp,text/plain';
const allowedTypes = new Set(ATTACHMENT_ACCEPT.split(','));

export function attachmentError(file: { size: number; type: string }): string {
  if (!Number.isFinite(file.size) || file.size <= 0) return 'Choose a non-empty file.';
  if (file.size > MAX_ATTACHMENT_BYTES) return 'This file is too large. Choose a file up to 4 MB.';
  if (!allowedTypes.has(file.type)) return 'Upload a PDF, JPG, PNG, WebP or text document.';
  return '';
}
