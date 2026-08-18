import { redirect } from "next/navigation";

import { isAdminAuthenticated } from "@/lib/cms/auth";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }
  return <AdminLoginForm />;
}
