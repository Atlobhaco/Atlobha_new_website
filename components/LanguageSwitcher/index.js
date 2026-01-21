import { useRouter } from "next/router";
import style from "./Switcher.module.scss";
import Image from "next/image";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { analytics } from "@/lib/firebase";
import { logEvent } from "firebase/analytics";

const LanguageSwitcher = () => {
  const router = useRouter();
  const { isMobile } = useScreenSize();

  const switchLocale = (locale) => {
    if (analytics) {
      logEvent(analytics, "LANGUAGE_SELECTED", {
        language: locale === "ar" ? "Arabic" : "English",
      });
    }
    if (window.gtag) {
      window.gtag("event", "LANGUAGE_SELECTED", {
        language: locale === "ar" ? "Arabic" : "English",
      });
    }
    router.push(router.pathname, router.asPath, { locale }).then(() => {
      router.reload();
    });
  };

  return (
    <div className={style.langSwitcher}>
      {router?.locale === "ar" ? (
        <button onClick={() => switchLocale("en")}>
          <Image
            src="/icons/lang-en.svg"
            alt="ar"
            width={isMobile ? 23 : 40}
            height={isMobile ? 23 : 40}
            loading="lazy"
          />
        </button>
      ) : (
        <button onClick={() => switchLocale("ar")}>
          <Image
            src="/icons/lang-ar.svg"
            alt="ar"
            width={isMobile ? 23 : 40}
            height={isMobile ? 23 : 40}
            loading="lazy"
          />
        </button>
      )}
    </div>
  );
};

export default LanguageSwitcher;
