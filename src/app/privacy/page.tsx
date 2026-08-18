import Link from "next/link";
import { Header } from "@/components/Header";
import { MobileTabBar } from "@/components/MobileTabBar";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteContentProvider } from "@/components/SiteContentProvider";
import {
  getLocalizedSettings,
  getLocalizedSiteContent,
} from "@/lib/cms/store";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "سياسة الخصوصية | شاغم",
};

export default async function PrivacyPage() {
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
        <main className="section-pad mx-auto max-w-3xl pb-[calc(6rem+env(safe-area-inset-bottom,0px))] pt-28 lg:pb-16">
          <h1 className="font-display text-3xl font-bold">سياسة الخصوصية</h1>
          <p className="mt-6 text-base leading-8 text-brand/70">
            نلتزم بحماية بياناتك واستخدامها فقط لغرض معالجة طلبات الانضمام وتقديم
            الخدمات والرد على استفساراتك. لا نشارك بياناتك مع أطراف ثالثة إلا عند
            الضرورة القانونية أو التشغيلية لتنفيذ الخدمة وبموافقاتك المطلوبة.
          </p>
          <Link
            href="/join-operator"
            className="mt-10 inline-flex text-sm font-semibold text-sand"
          >
            ← العودة للتسجيل
          </Link>
        </main>
        <SiteFooter />
        <MobileTabBar />
      </div>
    </SiteContentProvider>
  );
}
