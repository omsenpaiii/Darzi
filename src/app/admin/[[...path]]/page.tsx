import { AdminWorkspace } from "@/components/admin/admin-workspace";
export default async function Page({params}:{params:Promise<{path?:string[]}>}) {const {path}=await params;return <AdminWorkspace segments={path}/>;}
