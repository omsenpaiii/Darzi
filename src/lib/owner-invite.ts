import { createHash, timingSafeEqual } from 'node:crypto';
import type { StaffUser } from './types';

export function activationInviteValid(email: string, token: string, invite: unknown, now = Date.now()): boolean {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token) || !invite || typeof invite !== 'object') return false;
  const value = invite as {email?:unknown;hash?:unknown;expiresAt?:unknown};
  if (typeof value.email !== 'string' || value.email.toLowerCase() !== email.trim().toLowerCase()
    || typeof value.hash !== 'string' || !/^[a-f0-9]{64}$/.test(value.hash)
    || typeof value.expiresAt !== 'string' || !Number.isFinite(Date.parse(value.expiresAt)) || Date.parse(value.expiresAt) <= now) return false;
  return timingSafeEqual(createHash('sha256').update(token).digest(), Buffer.from(value.hash, 'hex'));
}

export function staffInviteValid(staff: (StaffUser & {activationInvite?:unknown}) | undefined, email: string, token: string, now = Date.now()): boolean {
  return !!staff && !staff.authUserId && staff.activationPending === true && !staff.active
    && staff.email.toLowerCase() === email.trim().toLowerCase()
    && activationInviteValid(email, token, staff.activationInvite, now);
}

export function ownerInviteValid(email: string, token: string, owners: string | undefined, config: string | undefined, now = Date.now()): boolean {
  const normalized = email.trim().toLowerCase();
  if (!owners?.split(',').some(owner => owner.trim().toLowerCase() === normalized) || !/^[A-Za-z0-9_-]{43}$/.test(token)) return false;
  try {
    const invites: unknown = JSON.parse(config || 'null');
    if (!Array.isArray(invites)) return false;
    return invites.some(invite => activationInviteValid(normalized, token, invite, now));
  } catch { return false; }
}
