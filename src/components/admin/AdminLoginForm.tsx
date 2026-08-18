"use client";

import { useActionState } from "react";

import { loginAdmin, type LoginState } from "@/app/admin/login/actions";
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
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>تسجيل دخول لوحة التحكم</CardTitle>
          <CardDescription>
            أدخل كلمة مرور المشرف للوصول إلى إدارة المحتوى والطلبات.
          </CardDescription>
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
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "جاري الدخول…" : "دخول"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
