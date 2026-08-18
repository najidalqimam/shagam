import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { getSubmissions } from "@/lib/cms/store";
import { SubmissionsPanel } from "@/components/admin/SubmissionsPanel";

export default async function AdminSubmissionsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const submissions = await getSubmissions();
  return <SubmissionsPanel initial={submissions} />;
}
