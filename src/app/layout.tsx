import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";
import { LocaleProvider } from "@/components/LocaleProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import "./globals.css";

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-ar",
  subsets: ["arabic"],
  weight: ["400", "600"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-en",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "شاغم — منصة خدمات الطائرات المسيّرة | Shagam",
  description:
    "اطلب الخدمة ونحن نذهب إليها. شاغم تجد المشغّل المؤهَّل وتدير التصاريح والتنفيذ والتحقق والفوترة. | Request the service and we go to it.",
  icons: {
    icon: "/logo-shagam.png",
    apple: "/logo-shagam.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "شاغم",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b4a45" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        plexArabic.variable,
        plexSans.variable,
      )}
    >
      <body className="min-h-full font-body">
        <LocaleProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
