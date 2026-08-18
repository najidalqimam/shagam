import {
  cities,
  complianceChecks,
  complianceItems,
  enterpriseItems,
  faqs,
  navLinks,
  operatorLevels,
  operatorPerks,
  serviceFilters,
  serviceOptions,
  services,
  stats,
  steps,
  whyItems,
} from "@/data/content";

export type NavLink = { href: string; label: string };
export type StatItem = { value: string; label: string };
export type StepItem = { num: string; title: string; body: string };
export type ServiceItem = {
  title: string;
  body: string;
  meta: string;
  kind: string;
};
export type TextItem = { q: string; a: string };
export type WhyItem = { title: string; body: string };
export type LevelItem = { level: string; title: string; body: string };
export type NamedItem = { title: string; body: string };

export type HeroContent = {
  eyebrow: string;
  title: string;
  body: string;
  primaryCta: string;
  secondaryCta: string;
};

export type HowContent = {
  eyebrow: string;
  title: string;
  body: string;
};

export type ContactContent = {
  eyebrow: string;
  title: string;
  body: string;
};

export type SiteContent = {
  navLinks: NavLink[];
  stats: StatItem[];
  complianceChecks: string[];
  steps: StepItem[];
  services: ServiceItem[];
  serviceFilters: { id: string; label: string }[];
  whyItems: WhyItem[];
  operatorPerks: string[];
  operatorLevels: LevelItem[];
  enterpriseItems: NamedItem[];
  complianceItems: string[];
  faqs: TextItem[];
  cities: string[];
  serviceOptions: string[];
  hero: HeroContent;
  how: HowContent;
  contact: ContactContent;
  why: { eyebrow: string; title: string; body: string };
  operators: { eyebrow: string; title: string; body: string; cta: string };
  enterprise: { eyebrow: string; title: string; body: string; cta: string };
  compliance: { eyebrow: string; title: string; body: string };
  faq: { eyebrow: string; title: string };
  servicesSection: { eyebrow: string; title: string; body: string; cta: string };
};

export type SiteSettings = {
  siteName: string;
  tagline: string;
  footerText: string;
  copyrightName: string;
  contactEmail: string;
  contactPhone: string;
  whatsapp: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  adminNotes: string;
};

export type ContentLocale = "ar" | "en";

export type LocalizedSiteContent = {
  ar: SiteContent;
  en: SiteContent;
};

export type LocalizedSiteSettings = {
  ar: SiteSettings;
  en: SiteSettings;
};

export type SubmissionStatus = "new" | "reviewed" | "archived";

export type FormSubmission = {
  id: string;
  createdAt: string;
  status: SubmissionStatus;
  payload: Record<string, unknown>;
};

export function defaultSiteContent(): SiteContent {
  return {
    navLinks: navLinks.map((l) => ({ ...l })),
    stats: stats.map((s) => ({ ...s })),
    complianceChecks: [...complianceChecks],
    steps: steps.map((s) => ({ ...s })),
    services: services.map((s) => ({
      title: s.title,
      body: s.body,
      meta: s.meta,
      kind: s.kind,
    })),
    serviceFilters: serviceFilters.map((f) => ({ id: f.id, label: f.label })),
    whyItems: whyItems.map((i) => ({ ...i })),
    operatorPerks: [...operatorPerks],
    operatorLevels: operatorLevels.map((i) => ({ ...i })),
    enterpriseItems: enterpriseItems.map((i) => ({ ...i })),
    complianceItems: [...complianceItems],
    faqs: faqs.map((f) => ({ ...f })),
    cities: [...cities],
    serviceOptions: [...serviceOptions],
    hero: {
      eyebrow: "اطلب الخدمة… ونحن نذهب إليها",
      title: "لا تبحث عن مشغّل — حدّد النتيجة وتولّى شاغم الباقي",
      body: "إيجاد المشغّل المؤهَّل، إدارة التصاريح، التنفيذ، التحقق، والفوترة — في مسار واحد.",
      primaryCta: "اطلب خدمة الآن",
      secondaryCta: "كيف تعمل المنصة؟",
    },
    how: {
      eyebrow: "كيف نعمل",
      title: "خمس خطوات من الاحتياج إلى الاستلام",
      body: "كل ما بين اختيار الخدمة وتحرير المستحقات تديره المنصة؛ أنت تحدد النتيجة فقط.",
    },
    contact: {
      eyebrow: "ابدأ الآن",
      title: "اطلب خدمة أو سجّل كمشغّل",
      body: "املأ النموذج ويتواصل معك فريقنا. الطلب لا يلزمك بشيء حتى تعتمد عرضاً.",
    },
    why: {
      eyebrow: "لماذا شاغم",
      title: "خدمة واحدة… ومسؤولية واحدة",
      body: "المشكلة ليست في التقنية ولا في المشغّلين. الغائب هو طرف يقف بين الجانبين ويتحمّل مسؤولية العملية.",
    },
    operators: {
      eyebrow: "للمشغّلين",
      title: "انضم إلى شبكة شاغم",
      body: "إذا كنت تملك طائرات وطاقماً وتراخيص سارية، فأنت لا تحتاج عملاء أكثر — تحتاج قناة وصول منتظمة وملف امتثال لا تعيد بناءه في كل مرة.",
      cta: "سجّل كمشغّل",
    },
    enterprise: {
      eyebrow: "للمنظمات",
      title: "تعاقد مرة واحدة بدل التفاوض في كل طلب",
      body: "إذا كان لديك مواقع متعددة أو احتياج متكرر، فالحساب المؤسسي يحوّل كل طلب إلى سحب من اتفاقية قائمة.",
      cta: "تحدّث إلى فريق الحسابات المؤسسية",
    },
    compliance: {
      eyebrow: "الامتثال والسلامة",
      title: "ما تشتريه ليس طيراناً",
      body: "بل ضماناً بأن ما نُفِّذ نظامي وموثّق ويمكن الاحتفاظ به واستخدامه قانونياً. هذه الطبقة هي المنتج نفسه، لا خدمة إضافية.",
    },
    faq: {
      eyebrow: "الأسئلة الشائعة",
      title: "ما يسأل عنه العملاء عادةً",
    },
    servicesSection: {
      eyebrow: "الخدمات",
      title: "كتالوج الخدمات",
      body: "لكل خدمة نموذج طلب خاص بها ومعيار تسليم معرّف مسبقاً — لا نموذج عام واحد لكل شيء.",
      cta: "اطلب خدمة الآن",
    },
  };
}

export function defaultSettings(): SiteSettings {
  return {
    siteName: "شاغم",
    tagline: "منصة خدمات الطائرات المسيّرة",
    footerText: "منصة خدمات الطائرات المسيّرة — اطلب الخدمة ونحن نذهب إليها.",
    copyrightName: "شاغم · تم تطويرها من خلال نجد القمم",
    contactEmail: "",
    contactPhone: "",
    whatsapp: "",
    facebookUrl: "",
    instagramUrl: "",
    twitterUrl: "",
    linkedinUrl: "",
    adminNotes: "",
  };
}
