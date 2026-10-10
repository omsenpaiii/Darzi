import { randomUUID } from 'node:crypto';
import { assertSameOrigin, neonAuth } from '@/lib/server/auth';
import { errorResponse, invariant } from '@/lib/server/errors';
import { readState, transaction } from '@/lib/server/store';
import { ownerInviteValid } from '@/lib/owner-invite';
import type { StaffUser } from '@/lib/types';
import { authFailureStatus, isDuplicateAuthAccount } from '@/lib/auth-provider-errors';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    invariant(process.env.DARZI_DEMO_DATA !== 'true' && process.env.NEON_AUTH_BASE_URL, 'Owner setup is unavailable.', 403);
    const text = await request.text();
    invariant(text.length <= 8192, 'The setup request is too large.', 413);
    let body;
    try { body = JSON.parse(text); } catch { invariant(false, 'Complete the account details.'); }
    invariant(body && typeof body === 'object' && !Array.isArray(body), 'Complete the account details.');
    invariant(typeof body.email === 'string' && typeof body.token === 'string' && typeof body.password === 'string' && typeof body.name === 'string', 'Complete the account details.');
    const email = body.email.trim().toLowerCase(), name = body.name.trim();
    invariant(ownerInviteValid(email, body.token, process.env.DARZI_OWNER_EMAILS, process.env.DARZI_OWNER_SETUP_INVITES), 'This private setup link is invalid or expired.', 403, 'INVITE_INVALID');
    invariant(name.length >= 2 && name.length <= 80 && body.password.length >= 12 && body.password.length <= 128, 'Use your name and a password of 12–128 characters.');
    const used = (await readState()).staff.some(user => user.email.toLowerCase() === email);
    invariant(!used, 'This account is already set up. Return to sign in.', 409, 'INVITE_USED');
    let result = await neonAuth().signUp.email({ email, name, password: body.password });
    // Recover an interrupted setup only with the same account's valid password
    // and its still-unused private invite; no password reset is performed here.
    if (isDuplicateAuthAccount(result.error)) result = await neonAuth().signIn.email({ email, password: body.password });
    invariant(!result.error && result.data?.user?.email.toLowerCase() === email && typeof result.data.user.id === 'string' && result.data.user.id.length > 0, result.error?.message || 'Account setup could not be completed.', authFailureStatus(result.error, 400), 'AUTH_SETUP_FAILED');
    const authUserId = result.data.user.id;
    const user = await transaction(state => {
      invariant(!state.staff.some(staff => staff.email.toLowerCase() === email), 'This setup link has already been used.', 409, 'INVITE_USED');
      invariant(!state.staff.some(staff => staff.authUserId === authUserId), 'This managed account already has workspace access.', 409);
      const owner: StaffUser = { id: randomUUID(), name, email, role: 'super_admin', team: 'ALL', active: true, authUserId };
      state.staff.push(owner);
      return owner;
    });
    return Response.json({ session: { user, mode: 'neon', demoData: false } }, { status: 201 });
  } catch (error) { return errorResponse(error); }
}
