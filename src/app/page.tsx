import { HomePage } from "@/components/HomePage";
import { SiteContentProvider } from "@/components/SiteContentProvider";
import {
  getLocalizedSettings,
  getLocalizedSiteContent,
} from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [content, settings] = await Promise.all([
    getLocalizedSiteContent(),
    getLocalizedSettings(),
  ]);

  return (
    <SiteContentProvider
      contentAr={content.ar}
      contentEn={content.en}
      settingsAr={settings.ar}
      settingsEn={settings.en}
    >
      <HomePage />
    </SiteContentProvider>
  );
}
