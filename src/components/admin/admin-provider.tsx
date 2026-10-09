"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { AdminState } from "@/lib/types";
import { safeAdminReturnPath } from "@/lib/admin-return-path";

type AdminContextValue = { data: AdminState | null; loading: boolean; error: string; notice: string; refresh: () => Promise<void>; request: <T = unknown>(path: string, method?: string, body?: unknown, authReturnPath?: string) => Promise<T>; clearNotice: () => void; setNotice: (message: string) => void; };
const AdminContext = createContext<AdminContextValue | null>(null);
export function AdminProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState<AdminState | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadedPath, setLoadedPath] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const refreshGeneration = useRef(0);
  const currentPath = useRef(pathname);
  currentPath.current = pathname;
  const signIn = pathname === "/admin/sign-in";
  const refresh = useCallback(async () => {
    // A mutation from the previous page must not supersede this page's refresh.
    if (currentPath.current !== pathname) return;
    const generation = ++refreshGeneration.current;
    const current = () => refreshGeneration.current === generation && currentPath.current === pathname;
    setLoading(true); setError("");
    if (signIn) { setData(null); setLoadedPath(pathname); setLoading(false); return; }
    try {
      const response = await fetch("/api/admin/state", { cache: "no-store" });
      const result = await response.json();
      if (!current()) return;
      if (response.status === 401) { setData(null); router.replace(`/admin/sign-in?next=${encodeURIComponent(safeAdminReturnPath(undefined, pathname))}`); return; }
      if (!response.ok) throw new Error(result.error || "The workspace could not be loaded.");
      setData(result); setError("");
    } catch (e) { if (current()) setError(e instanceof Error ? e.message : "Connection failed. Please retry."); }
    finally { if (current()) { setLoadedPath(pathname); setLoading(false); } }
  }, [pathname, router, signIn]);
  useEffect(() => { void refresh(); return () => { refreshGeneration.current++; }; }, [refresh]);
  const request = useCallback(async <T,>(path: string, method = "POST", body?: unknown, authReturnPath?: string): Promise<T> => {
    const response = await fetch(path, { method, headers: body instanceof FormData ? undefined : { "Content-Type": "application/json" }, body: body instanceof FormData ? body : body === undefined ? undefined : JSON.stringify(body) });
    const result = await response.json();
    if (response.status === 401) {
      if (currentPath.current === pathname) {
        refreshGeneration.current++; setData(null); setLoadedPath(null); setLoading(true);
        router.replace(`/admin/sign-in?next=${encodeURIComponent(safeAdminReturnPath(authReturnPath, pathname))}`);
      }
      throw new Error("Your session expired. Sign in to continue.");
    }
    if (!response.ok) { if(result.code === "STALE_VERSION") {await refresh();throw new Error("This garment changed while you were working. The latest details are loaded; review and retry your action.");} throw new Error(result.error || "This change could not be saved."); }
    if(method !== "GET") await refresh();
    return result as T;
  }, [pathname, refresh, router]);
  return <AdminContext.Provider value={{ data, loading: loading || (!signIn && loadedPath !== pathname), error, notice, refresh, request, clearNotice: () => setNotice(""), setNotice }}>{children}</AdminContext.Provider>;
}
export function useAdmin() { const context = useContext(AdminContext); if (!context) throw new Error("AdminProvider required"); return context; }
