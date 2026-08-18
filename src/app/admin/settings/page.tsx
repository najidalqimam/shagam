import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { getLocalizedSettings } from "@/lib/cms/store";
import { SettingsPanel } from "@/components/admin/SettingsPanel";

export default async function AdminSettingsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const settings = await getLocalizedSettings();
  return <SettingsPanel initial={settings} />;
}
