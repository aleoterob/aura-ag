"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useAuth } from "@/hooks/use-auth";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  const router = useRouter();
  const locale = useLocale();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push(`/${locale}/chat`);
    }
  }, [isAuthenticated, router, locale]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-card">
      <LoginForm />
    </div>
  );
}
