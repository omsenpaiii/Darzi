import { Suspense, type ReactNode } from "react";
import { AdminLayout } from "@/components/admin/admin-shell";
import { Loading } from "@/components/admin/admin-ui";
import type { Metadata } from "next";
export const metadata:Metadata={title:"DARZI · Atelier workspace",robots:{index:false,follow:false}};
export default function Layout({children}:{children:ReactNode}) {return <Suspense fallback={<Loading/>}><AdminLayout>{children}</AdminLayout></Suspense>;}
