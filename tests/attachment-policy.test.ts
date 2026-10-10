import assert from 'node:assert/strict';
import test from 'node:test';
import { attachmentError, MAX_ATTACHMENT_BYTES } from '../src/lib/attachment-policy';

test('the largest supported file leaves room for multipart data on Vercel', async () => {
  const form = new FormData();
  const file = new File([new Uint8Array(MAX_ATTACHMENT_BYTES)], 'measurement-sheet.pdf', { type: 'application/pdf' });
  form.set('file', file);
  assert.equal(attachmentError(file), '');
  const payload = await new Response(form).arrayBuffer();
  assert.ok(payload.byteLength < 4_500_000, 'The accepted upload must fit the hosted request ceiling.');
  assert.match(attachmentError({ size: MAX_ATTACHMENT_BYTES + 1, type: file.type }), /too large/);
});
test('empty files and unsupported formats are rejected before transfer', () => {
  assert.match(attachmentError({ size: 0, type: 'application/pdf' }), /non-empty/);
  assert.match(attachmentError({ size: 1024, type: 'application/x-msdownload' }), /Upload a PDF/);
  assert.equal(attachmentError({ size: 1024, type: 'image/jpeg' }), '');
});
