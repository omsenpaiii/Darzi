import type { StaffUser } from "./types";

export interface ManagedIdentity { id: string; email: string; }

export function legacyDemoIdentityAllowed(env: Record<string, string | undefined>): boolean {
  return env.DARZI_DEMO_DATA === "true" && env.NEON_PROJECT_ID === "icy-grass-38018123"
    && env.NEON_BRANCH_ID === "br-billowing-flower-b3bfld8x";
}

export function managedIdentityMatches(staff: StaffUser | undefined, identity: ManagedIdentity, allowLegacyDemo = false): boolean {
  return !!staff?.active && !!identity.id && staff.email.toLowerCase() === identity.email.toLowerCase()
    && (staff.authUserId ? staff.authUserId === identity.id : allowLegacyDemo);
}
