import { useRouter } from "next/router";
import style from "./Switcher.module.scss";
import Image from "next/image";

const LanguageSwitcher = () => {
  const router = useRouter();

  const switchLocale = (locale) => {
    router.push(router.pathname, router.asPath, { locale }).then(() => {
      router.reload();
    });
  };

  return (
    <div className={style.langSwitcher}>
      {router?.locale === "ar" ? (
        <button onClick={() => switchLocale("en")}>
          <Image src="/icons/lang-en.svg" alt="ar" width={40} height={40} />
        </button>
      ) : (
        <button onClick={() => switchLocale("ar")}>
          <Image src="/icons/lang-ar.svg" alt="ar" width={40} height={40} />
        </button>
      )}
    </div>
  );
};

export default LanguageSwitcher;
