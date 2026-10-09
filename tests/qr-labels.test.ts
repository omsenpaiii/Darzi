import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import QRCode from "qrcode";
import { BinaryBitmap, HybridBinarizer, QRCodeReader, RGBLuminanceSource } from "@zxing/library";
import { GARMENT_QR_OPTIONS, garmentQrUrl, parseGarmentCode, resolveLabelJob, resolveQrOrigin } from "../src/lib/qr-labels";
import type { GarmentItem } from "../src/lib/types";

const items = [
  { id: "piece-1", qrToken: "a47cb046-45a9-4944-ac2c-b2a82d3ce04f", stage: "stitching" },
  { id: "piece-2", qrToken: "8910a5b8-7244-4dc8-9f99-7ccf2f1f3500", stage: "completed" },
  { id: "draft-1", qrToken: "draft-token", stage: "draft" },
  { id: "unissued-1", qrToken: "unissued-token", stage: "new_order" },
] as GarmentItem[];

test("a print job requires explicit garments instead of defaulting to every record", () => {
  assert.equal(resolveLabelJob(items, null, null).items.length, 0);
  assert.ok(resolveLabelJob(items, "", null).error);
});
test("a batch deduplicates identities and retains independent pieces and copy count", () => {
  const job = resolveLabelJob(items, "piece-2,piece-1,piece-1", "3");
  assert.equal(job.error, "");
  assert.deepEqual(job.items.map(item => item.id), ["piece-2", "piece-1"]);
  assert.equal(job.copies, 3);
  assert.notEqual(job.items[0].qrToken, job.items[1].qrToken);
});
test("removed or inaccessible records cannot create a silently partial print job", () => {
  assert.ok(resolveLabelJob(items, "piece-1,missing", null).error);
  assert.deepEqual(resolveLabelJob(items.slice(1), "piece-1", null).items, []);
});
test("unissued intake rows cannot become physical labels while identities can still change", () => {
  assert.ok(resolveLabelJob(items, "draft-1", null).error);
  assert.ok(resolveLabelJob(items, "unissued-1", null).error);
  assert.deepEqual(resolveLabelJob(items, "piece-1,draft-1", null).items, []);
});
test("batch and copy limits reject malformed or excessive jobs", () => {
  for (const copies of ["0", "11", "1.5", "NaN", ""]) assert.ok(resolveLabelJob(items, "piece-1", copies).error);
  assert.ok(resolveLabelJob(items, Array.from({ length: 51 }, (_, index) => `piece-${index}`).join(","), "1").error);
});
test("lookup accepts garment links on the canonical/current site and rejects unrelated QR links", () => {
  const origins = ["https://darzi.example", "http://localhost:3000"];
  assert.equal(resolveQrOrigin("https://darzi.example/", "http://localhost:3000"), origins[0]);
  assert.equal(parseGarmentCode(garmentQrUrl(origins[0], items[0].qrToken), origins), items[0].qrToken);
  assert.equal(parseGarmentCode(" DZ-2026-1042-1 ", origins), "DZ-2026-1042-1");
  for (const value of ["https://other.example/admin/items/piece-1", "https://darzi.example/admin/orders/piece-1", "javascript:alert(1)", "not a code"]) assert.throws(() => parseGarmentCode(value, origins));
  assert.throws(() => resolveQrOrigin("file:///tmp/labels", origins[0]));
});
test("the actual printed QR image independently decodes to its unchanged garment URL", async () => {
  const png = createRequire(import.meta.url)("pngjs") as { PNG: { sync: { read: (bytes: Buffer) => { width: number; height: number; data: Uint8Array } } } };
  for (const item of items.slice(0, 2)) {
    const target = garmentQrUrl("https://darzi.example", item.qrToken);
    const bytes = await QRCode.toBuffer(target, GARMENT_QR_OPTIONS);
    assert.deepEqual(await QRCode.toBuffer(target, GARMENT_QR_OPTIONS), bytes, "Reprinting retains the same encoded identity.");
    const image = png.PNG.sync.read(bytes);
    const luminance = new Uint8ClampedArray(image.width * image.height);
    for (let index = 0; index < luminance.length; index++) luminance[index] = image.data[index * 4];
    const decoded = new QRCodeReader().decode(new BinaryBitmap(new HybridBinarizer(new RGBLuminanceSource(luminance, image.width, image.height))));
    assert.equal(decoded.getText(), target);
    assert.equal(parseGarmentCode(decoded.getText(), ["https://darzi.example"]), item.qrToken);
    assert.ok(!decoded.getText().includes("customer"));
  }
});
