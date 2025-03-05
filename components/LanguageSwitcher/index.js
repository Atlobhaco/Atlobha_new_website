import { useRouter } from "next/router";
import style from "./Switcher.module.scss";
import Image from "next/image";
import useScreenSize from "@/constants/screenSize/useScreenSize";

const LanguageSwitcher = () => {
  const router = useRouter();
  const { isMobile } = useScreenSize();

  const switchLocale = (locale) => {
    webengage.track("LANGUAGE_SELECTED", {
      language: locale === "ar" ? "Arabic" : "English",
    });
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
          />
        </button>
      ) : (
        <button onClick={() => switchLocale("ar")}>
          <Image
            src="/icons/lang-ar.svg"
            alt="ar"
            width={isMobile ? 23 : 40}
            height={isMobile ? 23 : 40}
          />
        </button>
      )}
    </div>
  );
};

export default LanguageSwitcher;
