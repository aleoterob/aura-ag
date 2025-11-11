import { redirect } from "next/navigation";
import { locales } from "@/i18n";

export default function Home() {
  redirect(`/${locales[1]}/login`);
}
