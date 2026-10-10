// Matches the installed Neon Auth SDK's session and local session-data namespace.
export function managedAuthCookieNames(names:readonly string[]):string[] {
  return names.filter(name=>name.startsWith("__Secure-neon-auth."));
}

export const MANAGED_AUTH_COOKIE_EXPIRY={path:"/",secure:true,httpOnly:true,sameSite:"lax" as const,maxAge:0,expires:new Date(0)};
