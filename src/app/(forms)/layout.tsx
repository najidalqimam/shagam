import { FormsEntryWorkspace } from "@/components/FormsEntryWorkspace";
import { Header } from "@/components/Header";
import { MobileTabBar } from "@/components/MobileTabBar";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { SiteContentProvider } from "@/components/SiteContentProvider";
import {
  getLocalizedSettings,
  getLocalizedSiteContent,
} from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export default async function FormsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <div className="min-h-screen bg-[#eef3f2] text-brand">
        <Header />
        <main>
          <FormsEntryWorkspace />
          <div className="hidden" aria-hidden>
            {children}
          </div>
        </main>
        <SiteFooter />
        <WhatsAppFloat />
        <MobileTabBar />
      </div>
    </SiteContentProvider>
  );
}
