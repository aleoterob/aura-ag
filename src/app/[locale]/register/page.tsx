"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/hooks/use-auth";
import { RegisterForm } from "@/components/auth/register-form";
import { RetroGrid } from "@/components/ui/retro-grid";
import { AuthFooter } from "@/components/auth/auth-footer";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

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
      {/* <AnimatedThemeToggler className="absolute top-4 right-8 z-50" /> */}
      <div className="relative flex flex-col z-10 min-h-screen items-center justify-center gap-3 2xl:gap-10">
        <div className="flex flex-col items-center justify-center gap-0 2xl:gap-2">
          <h1 className="text-4xl 2xl:text-6xl  font-light font-montserrat">
            {t("appTitle")}
          </h1>
          <h2 className="text-2xl 2xl:text-2xl font-light font-montserrat">
            {t("appDescription")}
          </h2>
          <h3 className="text-lg 2xl:text-xl font-light font-montserrat">
            {t("appSubtitle")}
          </h3>
        </div>
        <RegisterForm />
        <AuthFooter />
      </div>
    </div>
  );
}
