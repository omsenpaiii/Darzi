import assert from "node:assert/strict";
import test from "node:test";
import { safeAdminReturnPath } from "../src/lib/admin-return-path";

test("sign-in preserves exact admin and garment destinations", () => {
  for (const path of ["/admin", "/admin/", "/admin/items/a47cb046-45a9-4944-ac2c-b2a82d3ce04f", "/admin/scan?mode=rapid#lookup", "/admin/items/garment%2D1"]) {
    assert.equal(safeAdminReturnPath(path), path);
  }
});
test("an external, scheme-relative or similarly named path cannot be a return destination", () => {
  for (const path of ["https://evil.example/admin", "//evil.example/admin", "javascript:alert(1)", "/administrator", "/admin-other", "admin/items/item-1", "%2Fadmin"]) {
    assert.equal(safeAdminReturnPath(path), "/admin");
  }
});
test("browser traversal and slash aliases are rejected including encoded variants", () => {
  for (const path of ["/admin/../contact-us", "/admin/./items/item-1", "/admin/%2e%2e/contact-us", "/admin/%252e%252e/contact-us", "/admin//items/item-1", "/admin/%2f%2fevil.example", "/admin\\..\\contact-us", "/admin/%5c..%5ccontact-us"]) {
    assert.equal(safeAdminReturnPath(path), "/admin");
  }
});
test("a sign-in destination cannot loop back to sign-in", () => {
  for (const path of ["/admin/sign-in", "/admin/sign-in/", "/admin/sign-in?next=/admin/items/item-1", "/admin/sign-in#setup"]) {
    assert.equal(safeAdminReturnPath(path), "/admin");
  }
});
test("malformed, control-character and excessive return paths fail closed", () => {
  for (const path of [undefined, null, "", "/admin/%", "/admin/%00items", "/admin/\nitems", "/admin/%20items", "/admin/\u007fitems", "/admin/" + "x".repeat(2048)]) {
    assert.equal(safeAdminReturnPath(path), "/admin");
  }
});
test("a bad QR target falls back only to another validated admin path", () => {
  assert.equal(safeAdminReturnPath("//evil.example", "/admin/scan"), "/admin/scan");
  assert.equal(safeAdminReturnPath(undefined, "/admin/items/item-1"), "/admin/items/item-1");
  for (const fallback of ["//evil.example", "/admin/../contact-us", "/admin/sign-in", "/administrator"]) assert.equal(safeAdminReturnPath(undefined, fallback), "/admin");
});
