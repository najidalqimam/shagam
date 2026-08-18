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
  title: "الشروط والأحكام | شاغم",
};

export default async function TermsPage() {
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
          <h1 className="font-display text-3xl font-bold">الشروط والأحكام</h1>
          <p className="mt-6 text-base leading-8 text-brand/70">
            باستخدامك منصة شاغم أو تقديم طلب انضمام كمشغّل، فإنك تقر بصحة البيانات
            المقدّمة وتوافق على مراجعة طلبك وفق سياسات التأهيل والامتثال المعتمدة.
            تحتفظ شاغم بحق قبول أو رفض الطلبات وفق معايير التشغيل والسلامة.
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
