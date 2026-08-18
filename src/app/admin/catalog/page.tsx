import { redirect } from "next/navigation";
import { CatalogPanel } from "@/components/admin/CatalogPanel";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { getDroneCatalog } from "@/lib/cms/store";

export default async function AdminCatalogPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const catalog = await getDroneCatalog();
  return (
    <CatalogPanel
      initial={{
        version: catalog.version,
        manufacturersCount: catalog.manufacturers.length,
        modelsCount: catalog.manufacturers.reduce(
          (n, m) => n + m.models.length,
          0,
        ),
        generatedAt: catalog.generatedAt,
        source: catalog.source,
        manufacturers: catalog.manufacturers,
      }}
    />
  );
}
