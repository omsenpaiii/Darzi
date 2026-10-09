import { createHash, timingSafeEqual } from 'node:crypto';

export function ownerInviteValid(email: string, token: string, owners: string | undefined, config: string | undefined, now = Date.now()): boolean {
  const normalized = email.trim().toLowerCase();
  if (!owners?.split(',').some(owner => owner.trim().toLowerCase() === normalized) || !/^[A-Za-z0-9_-]{43}$/.test(token)) return false;
  try {
    const invites: unknown = JSON.parse(config || 'null');
    if (!Array.isArray(invites)) return false;
    const actual = createHash('sha256').update(token).digest();
    return invites.some(invite => invite && typeof invite === 'object'
      && invite.email?.toLowerCase() === normalized && typeof invite.hash === 'string'
      && /^[a-f0-9]{64}$/.test(invite.hash) && Number.isFinite(Date.parse(invite.expiresAt))
      && Date.parse(invite.expiresAt) > now && timingSafeEqual(actual, Buffer.from(invite.hash, 'hex')));
  } catch { return false; }
}
