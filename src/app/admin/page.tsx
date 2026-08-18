import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Archive,
  ArrowUpRight,
  Bell,
  Boxes,
  CheckCircle2,
  MessageSquareText,
  Plane,
  Settings,
} from "lucide-react";

import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { getDashboardStats } from "@/lib/cms/store";
import type { FormSubmission } from "@/lib/cms/types";

const statusLabel: Record<FormSubmission["status"], string> = {
  new: "جديد",
  reviewed: "تمت المراجعة",
  archived: "مؤرشف",
};

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("ar-SA", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const stats = await getDashboardStats();

  const metrics = [
    {
      label: "إجمالي الطلبات",
      value: stats.submissionsTotal,
      href: "/admin/submissions",
      icon: MessageSquareText,
    },
    {
      label: "جديدة",
      value: stats.submissionsNew,
      href: "/admin/submissions",
      icon: Bell,
    },
    {
      label: "تمت المراجعة",
      value: stats.submissionsReviewed,
      href: "/admin/submissions",
      icon: CheckCircle2,
    },
    {
      label: "مؤرشفة",
      value: stats.submissionsArchived,
      href: "/admin/submissions",
      icon: Archive,
    },
  ];

  const distribution = [
    { label: "جديد", value: stats.submissionsNew },
    { label: "تمت المراجعة", value: stats.submissionsReviewed },
    { label: "مؤرشف", value: stats.submissionsArchived },
  ];
  const maxDist = Math.max(1, ...distribution.map((d) => d.value));

  const shortcuts = [
    {
      title: "محتوى الموقع",
      description: "إضافة وتعديل وحذف النصوص والأقسام",
      href: "/admin/content",
      icon: Boxes,
      meta: `${stats.services} خدمة · ${stats.faqs} سؤال`,
    },
    {
      title: "طلبات النموذج",
      description: "مراجعة وحذف طلبات العملاء والمشغّلين",
      href: "/admin/submissions",
      icon: MessageSquareText,
      meta: `${stats.submissionsNew} جديد`,
    },
    {
      title: "كتالوج الطائرات",
      description: "إضافة وتعديل وحذف الشركات والموديلات",
      href: "/admin/catalog",
      icon: Plane,
      meta: "إدارة كاملة",
    },
    {
      title: "الإعدادات",
      description: "الاسم والتذييل وبيانات التواصل",
      href: "/admin/settings",
      icon: Settings,
      meta: "إعدادات عامة",
    },
  ];

  return (
    <AdminShell
      title="نظرة عامة"
      subtitle="ملخص سريع لحالة الطلبات والمحتوى"
      actions={
        <Button asChild size="sm">
          <Link href="/admin/submissions">
            الطلبات
            <ArrowUpRight />
          </Link>
        </Button>
      }
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardDescription>{card.label}</CardDescription>
                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold tracking-tight">
                  {card.value}
                </div>
                <Button
                  asChild
                  variant="link"
                  size="sm"
                  className="mt-2 h-auto px-0"
                >
                  <Link href={card.href}>عرض التفاصيل</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>آخر الطلبات</CardTitle>
            <CardDescription>أحدث ما وصل من نموذج التواصل</CardDescription>
            <CardAction>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/submissions">عرض الكل</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {stats.recentSubmissions.length === 0 ? (
              <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
                لا توجد طلبات بعد.
              </div>
            ) : (
              <ul>
                {stats.recentSubmissions.map((item, index) => (
                  <li key={item.id}>
                    {index > 0 && <Separator />}
                    <Link
                      href="/admin/submissions"
                      className="flex items-start justify-between gap-3 py-3 transition hover:bg-muted/40"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate font-medium">
                            {String(item.payload.fullName || "بدون اسم")}
                          </p>
                          <Badge
                            variant={
                              item.status === "new" ? "default" : "secondary"
                            }
                          >
                            {statusLabel[item.status]}
                          </Badge>
                        </div>
                        <p className="truncate text-sm text-muted-foreground">
                          {String(item.payload.email || "—")}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {String(
                            item.payload.service ||
                              item.payload.role ||
                              "طلب جديد",
                          )}
                        </p>
                      </div>
                      <time className="shrink-0 text-xs text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </time>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>توزيع الحالات</CardTitle>
              <CardDescription>حالة طلبات النموذج</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.submissionsTotal === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  لا بيانات للعرض بعد.
                </p>
              ) : (
                <div className="space-y-4">
                  {distribution.map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.label}
                        </span>
                        <span className="font-medium">{item.value}</span>
                      </div>
                      <Progress value={(item.value / maxDist) * 100} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>محتوى الموقع</CardTitle>
              <CardDescription>أرقام سريعة من المحتوى المنشور</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-muted/50 px-2 py-3">
                  <p className="text-2xl font-semibold">{stats.services}</p>
                  <p className="mt-1 text-xs text-muted-foreground">خدمات</p>
                </div>
                <div className="rounded-lg bg-muted/50 px-2 py-3">
                  <p className="text-2xl font-semibold">{stats.faqs}</p>
                  <p className="mt-1 text-xs text-muted-foreground">أسئلة</p>
                </div>
                <div className="rounded-lg bg-muted/50 px-2 py-3">
                  <p className="text-2xl font-semibold">{stats.cities}</p>
                  <p className="mt-1 text-xs text-muted-foreground">مدن</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <div className="mb-3">
          <h2 className="text-base font-semibold">اختصارات سريعة</h2>
          <p className="text-sm text-muted-foreground">
            انتقل مباشرة لأهم صفحات الإدارة
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {shortcuts.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Card className="h-full transition hover:bg-muted/40">
                  <CardHeader>
                    <div className="mb-2 flex size-9 items-center justify-center rounded-lg border bg-background">
                      <Icon className="size-4" />
                    </div>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">{item.meta}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </AdminShell>
  );
}
