function isSafeAdminPath(path: string | null | undefined): path is string {
  if (!path || path.length > 2048 || !path.startsWith("/")) return false;
  try {
    const decoded = decodeURIComponent(path);
    // Redirects need one absolute application path, without browser path aliases.
    if (/[\\\u0000-\u0020\u007f]/.test(decoded) || decoded.includes("//") || /%[\da-f]{2}/i.test(decoded)) return false;
    const route = decoded.split(/[?#]/, 1)[0];
    if (route !== "/admin" && !route.startsWith("/admin/")) return false;
    if (route.replace(/\/$/, "") === "/admin/sign-in") return false;
    return !route.split("/").some(segment => segment === "." || segment === "..");
  } catch { return false; }
}

export function safeAdminReturnPath(candidate: string | null | undefined, fallback = "/admin"): string {
  return isSafeAdminPath(candidate) ? candidate : isSafeAdminPath(fallback) ? fallback : "/admin";
}
