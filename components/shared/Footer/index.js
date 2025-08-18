import React from "react";
import style from "./Footer.module.scss";
import { Box, Divider } from "@mui/material";
import { useRouter } from "next/router";
import useLocalization from "@/config/hooks/useLocalization";
import Image from "next/image";
import Link from "next/link";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@/config/providers/AuthProvider";
import { MARKETPLACE, SPAREPARTS } from "@/constants/enums";
import { APP_SECTIONS_GROUPS } from "@/config/endPoints/endPoints";
import { setAllGroups } from "@/redux/reducers/appGroups";
import { toast } from "react-toastify";
import useCustomQuery from "@/config/network/Apiconfig";

function Footer() {
  const router = useRouter();
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();
  const { allGroups } = useSelector((state) => state.appGroups);
  const { user } = useAuth();
  const dispatch = useDispatch();

  useCustomQuery({
    name: "sectionGroupsFooter",
    url: `${APP_SECTIONS_GROUPS}`,
    refetchOnWindowFocus: false,
    enabled: true,
    select: (res) => res?.data?.data,
    onSuccess: (res) => {
      dispatch(setAllGroups(res));
    },
    onError: () => {
      toast.error(t.someThingWrong);
    },
  });

  const storeSections = [
    {
      id: 1,
      text: t.sparePart,
      link: "/spareParts",
    },
    {
      id: 2,
      text: t.accessories,
      link: "/category/10",
    },
    {
      id: 3,
      text: t.oils,
      link: "",
    },
    {
      id: 4,
      text: t.carCare,
      link: "",
    },
    {
      id: 5,
      text: t.washing,
      link: "",
    },
  ];

  const serviceSections = [
    {
      id: 1,
      text: t.tiresBatteries,
      link: "",
    },
    {
      id: 2,
      text: t.washAndCare,
      link: "",
    },
    {
      id: 3,
      text: t.replaceRepair,
      link: "",
    },
  ];

  const handleAppSectionRedirection = (section) => {
    if (section?.type === SPAREPARTS || section?.type === MARKETPLACE) {
      router.push(section?.type === MARKETPLACE ? "/" : "/spareParts");
    } else {
      router.push(
        `/sections?secTitle=${section?.title}&secType=${section?.type}`
      );
    }
  };

  return (
    <footer className={`${style["footer"]}`}>
      <div className="row">
        <div className={`col-12 col-md-3`}>
          <div className={`${style["footer-header"]}`}>{t.atlobhaSections}</div>
          <ul className={`${style["footer-links"]}`}>
            {allGroups
              ?.map((data) => data?.sections)
              ?.flat()
              ?.map((data) => (
                <li
                  key={data?.id}
                  onClick={() => handleAppSectionRedirection(data)}
                >
                  {data?.title}
                </li>
              ))}
          </ul>
        </div>
        <div className={`col-12 col-md-3`}>
          <div className={`${style["footer-header"]}`}>{t.storeSections}</div>
          <ul className={`${style["footer-links"]}`}>
            {storeSections?.map((data) => (
              <li key={data?.id} onClick={() => router.push(data?.link)}>
                {data?.text}
              </li>
            ))}
          </ul>
        </div>
        <div className={`col-12 col-md-3`}>
          <div className={`${style["footer-header"]}`}>{t.serviceSections}</div>
          <ul className={`${style["footer-links"]}`}>
            {serviceSections?.map((data) => (
              <li key={data?.id}>{data?.text}</li>
            ))}
          </ul>
        </div>
        <div className={`${style["footer-links"]} col-12 col-md-3`}>
          <div className={`${style["footer-help"]}`}>{t.helpCenter}</div>
          <div
            onClick={() => {
              window.webengage.onReady(() => {
                webengage.track("CUSTOMER_SUPPORT_CLICKED", {
                  event_status: true,
                });
              });
              router.push("mailto:info@atlobha.com");
            }}
            className={`${style["footer-help_info"]}`}
          >
            <Image
              src="/icons/at-email.svg"
              alt="at-email"
              width={20}
              height={20}
              loading="lazy"
            />
            <span>info@atlobha.com</span>
          </div>
          <div
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
            className={`${style["footer-help_info"]}`}
          >
            <Box
              sx={{
                background: "white",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src="/icons/Brand.png"
                alt="at-email"
                width={20}
                height={20}
                style={{
                  width: "auto",
                  height: "auto",
                }}
                loading="lazy"
              />
            </Box>{" "}
            <span>
              {locale == "en" && "+"}966502670094{locale == "ar" && "+"}
            </span>
          </div>

          <Box
            sx={{
              display: "flex",
              gap: "15px",
              marginBottom: "16px",
            }}
          >
            <Link href="https://twitter.com/Atlobha_ksa" target="_blank">
              <Image
                alt="twitter"
                src="/icons/social/twitter-yellow.svg"
                width={26}
                height={26}
                loading="lazy"
              />
            </Link>

            <Link href="https://www.instagram.com/Atlobha_ksa" target="_blank">
              <Image
                alt="insta"
                src="/icons/social/instgram-yellow.svg"
                width={26}
                height={26}
                loading="lazy"
              />
            </Link>

            <Link href="http://www.tiktok.com/@atlobha_ksa" target="_blank">
              <Image
                alt="tiktok"
                src="/icons/social/tiktok-yellow.svg"
                width={26}
                height={26}
                loading="lazy"
              />
            </Link>

            <Link
              href="https://www.snapchat.com/add/Atlobha_ksa"
              target="_blank"
            >
              <Image
                alt="snapchat"
                src="/icons/social/snap-chat-yellow.svg"
                width={26}
                height={26}
                className="cursor-pointer"
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
                src="/icons/social/whatsapp-yellow.svg"
                width={26}
                height={26}
                className="cursor-pointer"
                loading="lazy"
              />
            </Link>
          </Box>

          <Box
            sx={{
              marginBottom: "16px",
            }}
          >
            <Image
              src="/logo/ar-atlobha-over-en.svg"
              alt="logo"
              width={isMobile ? 130 : 147}
              height={isMobile ? 40 : 57}
              onClick={() => router.push("/")}
              loading="lazy"
            />
          </Box>

          <Box
            sx={{
              marginBottom: "16px",
            }}
            className="d-flex align-items-center gap-2 flex-wrap"
          >
            <Link
              href="https://play.google.com/store/apps/details?id=com.atlobha.atlobha&referrer=utm_source%3Dtelegram%2520group%26utm_medium%3Dcs95%26anid%3Dadmob"
              target="_blank"
            >
              <Image
                src="/imgs/get-google-play.svg"
                alt="google-play"
                width={108}
                height={30}
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
                height={30}
                loading="lazy"
              />
            </Link>
          </Box>
        </div>
      </div>

      <Divider sx={{ background: "#EAECF0", mt: 1, mb: 1 }} />

      <div className="row">
        <Box
          sx={{
            marginBottom: "16px",
          }}
          className="col-12 col-md-6"
        >
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
        <div
          className={`col-12 col-md-6 d-flex ${
            isMobile ? "justify-content-center" : "justify-content-end"
          } align-items-center gap-4 flex-wrap`}
        >
          <Box
            sx={{
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            Copyright © ATLOBHA. All rights reserved.
          </Box>
          <Image
            loading="lazy"
            src="/icons/full-pay-images.svg"
            alt="pay"
            width={20}
            height={20}
            style={{
              width: "unset",
              height: "unset",
            }}
          />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
