import assert from "node:assert/strict";
import test from "node:test";
import type { AdminState } from "../src/lib/types";

const origin = process.env.DARZI_TEST_ORIGIN || "http://localhost:3000";
async function get(path: string, cookie = "") {
  const response = await fetch(origin + path, { headers: { Cookie: cookie } });
  return { status: response.status, body: await response.json() };
}
async function signIn(email: string) {
  const response = await fetch(`${origin}/api/session`, { method: "POST", headers: { "Content-Type": "application/json", Origin: origin }, body: JSON.stringify({ email, password: "DarziPreview2026!" }) });
  if (response.status !== 200) {
    const failure = await response.json();
    assert.fail(`Development QR sign-in failed (${response.status}): ${failure.error || failure.code || 'Unknown error'}`);
  }
  const cookie = response.headers.getSetCookie().map(value => value.split(";")[0]).join("; ");
  const state = await get("/api/admin/state", cookie);
  assert.equal(state.status, 200);
  assert.equal(state.body.session.demoData, true, "QR checks must use the explicitly synthetic development workspace.");
  return { cookie, state: state.body as AdminState };
}

test("a printed QR resolves the same protected garment across team sessions", { timeout: 90000 }, async t => {
  const au = await signIn("melbourne@darzi.test");
  const india = await signIn("workshop@darzi.test");
  const garment = au.state.items.find(item => item.id === "item-1")!;
  assert.ok(garment);
  await t.test("opening the opaque printed route anonymously requires credentials", async () => {
    assert.equal((await get(`/api/admin/items/${garment.qrToken}`)).status, 401);
    assert.equal((await get(`/api/admin/qr?code=${garment.qrToken}`)).status, 401);
  });
  await t.test("the token, item ID and printed number all identify the exact same piece", async () => {
    for (const code of [garment.qrToken, garment.id, garment.number.toLowerCase()]) {
      const result = await get(`/api/admin/qr?code=${encodeURIComponent(code)}`, au.cookie);
      assert.equal(result.status, 200);
      assert.equal(result.body.item.id, garment.id);
      assert.equal(result.body.item.qrToken, garment.qrToken);
    }
  });
  await t.test("India can resolve a production garment without gaining customer contact fields", async () => {
    const result = await get(`/api/admin/items/${garment.qrToken}`, india.cookie);
    assert.equal(result.status, 200);
    assert.equal(result.body.item.id, garment.id);
    assert.ok(india.state.customers.every(customer => customer.email === undefined && customer.phone === undefined));
  });
  await t.test("knowing a draft token does not bypass workshop permissions", async () => {
    const draft = au.state.items.find(item => item.stage === "draft");
    assert.ok(draft, "The synthetic development dataset should contain an intake draft.");
    assert.equal((await get(`/api/admin/items/${draft.qrToken}`, india.cookie)).status, 403);
  });
  await t.test("invalid labels return a clear error without matching another garment", async () => {
    const result = await get("/api/admin/qr?code=not-a-darzi-garment", au.cookie);
    assert.equal(result.status, 404);
    assert.equal(result.body.code, "INVALID_QR");
  });
  await t.test("lookups do not advance a stage or replace the saved identity", async () => {
    const latest = await get(`/api/admin/items/${garment.qrToken}`, au.cookie);
    assert.equal(latest.body.item.version, garment.version);
    assert.equal(latest.body.item.stage, garment.stage);
    assert.equal(latest.body.item.qrToken, garment.qrToken);
  });
});
