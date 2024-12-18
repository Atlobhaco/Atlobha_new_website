import { useRouter } from "next/router";
import en from "@/locales/en";
import ar from "@/locales/ar";

export default function useLocalization() {
  const { locale } = useRouter();
  const t = locale === "en" ? en : ar;
  return { t, locale };
}
