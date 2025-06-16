import { Box } from "@mui/material";
import React from "react";
import style from "./comingSoon.module.scss";
import Image from "next/image";
import SharedBtn from "../shared/SharedBtn";
import Link from "next/link";
import useLocalization from "@/config/hooks/useLocalization";
import { useRouter } from "next/router";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { checkApplePayAvailability } from "@/constants/helpers";

function ComingSoon() {
  const { t } = useLocalization();
  const router = useRouter();
  const { isMobile } = useScreenSize();

  return (
    <Box className={`${style["soon"]}`}>
      <Box className="position-relative">
        <Box className="d-flex justify-content-center">
          <Image
            alt="img-atlobha"
            src="/logo/ar-en-road-atlobha.svg"
            width={isMobile ? 180 : 276}
            height={isMobile ? 30 : 40}
            priority={false}
            loading="lazy"
          />
        </Box>
        <Box className="d-flex mt-4 justify-content-center">
          <Image
            alt="maintance-atlobha"
            src="/imgs/maintance-man.svg"
            width={isMobile ? 220 : 346}
            height={isMobile ? 160 : 231}
            priority={true}
            loading="lazy"
            style={{
              zIndex: 1,
            }}
          />
        </Box>
        <Box className={`${isMobile ? "mt-2" : "mt-3"} ${style["header"]}`}>
          {t.comingsoon}
        </Box>
        <Box>
          <Image
            alt="patter-atlobha"
            src="/icons/pattern.png"
            width={isMobile ? 220 : 346}
            height={isMobile ? 142 : 189}
            priority={false}
            loading="lazy"
            style={{
              position: "absolute",
              width: "100%",
              left: "0px",
              top: "52%",
              zIndex: 0,
            }}
          />
        </Box>
      </Box>
      <Box className={`${style["progress"]}`}>
        <Box className={`${style["progress-text"]}`}>{t.pageUnderDevelop} </Box>
        <Box className="d-flex w-100 justify-content-center">
          <SharedBtn
            className="black-btn"
            customClass={`${isMobile ? "w-100 sm-font-size" : "w-50"}`}
            text="downloadAndEnjoy"
            customStyle={{
              fontSize: isMobile ? "13px" : "inherit",
            }}
            onClick={() => {
              if (checkApplePayAvailability()) {
                window.open(
                  "https://apps.apple.com/sa/app/%D8%A7%D8%B7%D9%84%D8%A8%D9%87%D8%A7-%D9%82%D8%B7%D8%B9-%D8%BA%D9%8A%D8%A7%D8%B1-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%B1%D8%A7%D8%AA/id1415692116?l=ar",
                  "_blank",
                  "noopener,noreferrer"
                );
              } else {
                window.open(
                  `https://play.google.com/store/apps/details?id=com.atlobha.atlobha&referrer=utm_source%3Dtelegram%2520group%26utm_medium%3Dcs95%26anid%3Dadmob`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }
            }}
          />
        </Box>
      </Box>

      <Box className={`${style["questions"]}`}>
        <Box>{t.ifHaveAnyQuestions}</Box>
        <Box className={`${isMobile ? "w-100" : ""}`}>
          <SharedBtn
            customClass={`${isMobile ? "w-100" : "unset"}`}
            className="big-main-btn"
            text="helpCenter"
            onClick={() => {
              window.open(
                `https://api.whatsapp.com/send/?phone=966502670094&text&type=phone_number&app_absent=0`,
                "_blank",
                "noopener,noreferrer"
              );
              window.webengage.onReady(() => {
                webengage.track("CUSTOMER_SUPPORT_CLICKED", {
                  event_status: true,
                });
              });
            }}
          />
        </Box>
      </Box>

      <Box className={`${style["social"]}`}>
        <Link href="https://twitter.com/Atlobha_ksa" target="_blank">
          <Image
            alt="twitter"
            src="/icons/social/twitter.svg"
            width={28}
            height={28}
            priority={false}
            loading="lazy"
          />
        </Link>

        <Link href="https://www.instagram.com/Atlobha_ksa" target="_blank">
          <Image
            alt="insta"
            src="/icons/social/insta.svg"
            width={28}
            height={28}
            priority={false}
            loading="lazy"
          />
        </Link>

        <Link href="http://www.tiktok.com/@atlobha_ksa" target="_blank">
          <Image
            alt="tiktok"
            src="/icons/social/tiktok.svg"
            width={28}
            height={28}
            priority={false}
            loading="lazy"
          />
        </Link>

        <Link href="https://www.snapchat.com/add/Atlobha_ksa" target="_blank">
          <Image
            alt="snapchat"
            src="/icons/social/snap.svg"
            width={28}
            height={28}
            className="cursor-pointer"
            priority={false}
            loading="lazy"
          />
        </Link>

        <Link
          onClick={() =>
            window.webengage.onReady(() => {
              webengage.track("CUSTOMER_SUPPORT_CLICKED", {
                event_status: true,
              });
            })
          }
          href="https://wa.me/966502670094"
          target="_blank"
        >
          <Image
            alt="whatsapp"
            src="/icons/social/whatsapp.svg"
            width={28}
            height={28}
            className="cursor-pointer"
            priority={false}
            loading="lazy"
          />
        </Link>
      </Box>

      <Box
        sx={{
          margin: "15px 0px",
        }}
        className="d-flex align-items-center gap-3 justify-content-center flex-wrap"
      >
        <Link
          href="https://play.google.com/store/apps/details?id=com.atlobha.atlobha&referrer=utm_source%3Dtelegram%2520group%26utm_medium%3Dcs95%26anid%3Dadmob"
          target="_blank"
        >
          <Image
            src="/imgs/get-google-play.svg"
            alt="google-play"
            width={108}
            height={60}
            style={{
              height: "auto",
              width: "auto",
            }}
            priority={false}
            loading="lazy"
          />
        </Link>

        <Link
          href="https://apps.apple.com/sa/app/%D8%A7%D8%B7%D9%84%D8%A8%D9%87%D8%A7-%D9%82%D8%B7%D8%B9-%D8%BA%D9%8A%D8%A7%D8%B1-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%B1%D8%A7%D8%AA/id1415692116?l=ar"
          target="_blank"
        >
          <Image
            src="/imgs/get-apple-store.svg"
            alt="apple-store"
            width={108}
            height={60}
            style={{
              height: "auto",
              width: "auto",
            }}
            priority={false}
            loading="lazy"
          />
        </Link>
      </Box>
      <Box className={`${style["static-pages"]}`}>
        <Box
          onClick={() => {
            router.push("/userProfile/returnPolicy?customScreens=true");
          }}
          className={`${style["static-pages_links"]}`}
        >
          {t.returnPolicy}
        </Box>
        <Box
          onClick={() => {
            router.push("/userProfile/privacyPolicy?customScreens=true");
          }}
          className={`${style["static-pages_links"]}`}
        >
          {t.privacyPolicy}
        </Box>
        <Box
          onClick={() => {
            router.push("/userProfile/termsCondition?customScreens=true");
          }}
          className={`${style["static-pages_links"]}`}
        >
          {t.termsCondition}
        </Box>
      </Box>
    </Box>
  );
}

export default ComingSoon;
