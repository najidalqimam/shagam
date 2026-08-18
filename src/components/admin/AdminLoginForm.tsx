"use client";

import { useActionState } from "react";

import { loginAdmin, type LoginState } from "@/app/admin/login/actions";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: LoginState = { error: "" };

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, initial);

  return (
    <div className="admin-theme flex min-h-screen items-center justify-center bg-primary px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4">
          <BrandLogo className="h-10 w-auto max-w-[180px]" />
          <div className="space-y-1">
            <CardTitle>تسجيل دخول لوحة التحكم</CardTitle>
            <CardDescription>
              أدخل كلمة مرور المشرف للوصول إلى إدارة المحتوى والطلبات.
            </CardDescription>
          </div>
        </CardHeader>
        <form action={action}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoFocus
                autoComplete="current-password"
              />
            </div>
            {state.error ? (
              <p className="text-sm text-destructive" role="alert">
                {state.error}
              </p>
            ) : null}
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={pending}
              className="w-full bg-sand text-primary hover:bg-sand/90"
            >
              {pending ? "جاري الدخول…" : "دخول"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
