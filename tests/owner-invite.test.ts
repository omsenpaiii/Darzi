import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import { ownerInviteValid } from '../src/lib/owner-invite';

const token = 'a'.repeat(43), now = Date.parse('2026-10-09T12:00:00Z');
const hash = createHash('sha256').update(token).digest('hex');
const owners = 'first@example.test,second@example.test';
const config = JSON.stringify([{ email: 'first@example.test', hash, expiresAt: '2026-10-10T12:00:00Z' }]);

test('a private owner invite is bound to its exact approved email', () => {
  assert.equal(ownerInviteValid(' FIRST@example.test ', token, owners, config, now), true);
  assert.equal(ownerInviteValid('second@example.test', token, owners, config, now), false);
  assert.equal(ownerInviteValid('other@example.test', token, owners, config, now), false);
});
test('a guessed, malformed or missing token is denied', () => {
  for (const value of ['b'.repeat(43), token.slice(1), '', token + 'x', '/'.repeat(43)]) assert.equal(ownerInviteValid('first@example.test', value, owners, config, now), false);
});
test('an invite expires and cannot grant an email outside the owner allow-list', () => {
  assert.equal(ownerInviteValid('first@example.test', token, owners, config, Date.parse('2026-10-10T12:00:00Z')), false);
  assert.equal(ownerInviteValid('first@example.test', token, 'second@example.test', config, now), false);
});
test('missing or malformed invitation configuration fails closed', () => {
  for (const value of [undefined, '', 'no-json', '{}', 'null', '[]', '[null]', JSON.stringify([{ email: 'first@example.test', hash: 'bad', expiresAt: 'never' }])]) assert.equal(ownerInviteValid('first@example.test', token, owners, value, now), false);
});
