import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { getLocalizedSiteContent } from "@/lib/cms/store";
import { ContentEditor } from "@/components/admin/ContentEditor";

export default async function AdminContentPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const content = await getLocalizedSiteContent();
  return <ContentEditor initial={content} />;
}
