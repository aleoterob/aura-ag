"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/hooks/use-auth";
import { RegisterForm } from "@/components/register-form";
import { RetroGrid } from "@/components/ui/retro-grid";

export default function RegisterPage() {
  const t = useTranslations("auth");
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
    <div className="relative min-h-screen overflow-hidden bg-card">
      <RetroGrid className="inset-0" />
      <div className="relative flex flex-col z-10 min-h-screen items-center justify-center gap-10">
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-6xl font-medium font-montserrat">
            {t("appTitle")}
          </h1>
          <h2 className="text-3xl font-light font-montserrat">
            {t("appDescription")}
          </h2>
          <h3 className="text-xl font-light font-montserrat">
            {t("appSubtitle")}
          </h3>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
