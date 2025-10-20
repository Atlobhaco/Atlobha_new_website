import BreadCrumb from "@/components/BreadCrumb";
import ProfileSetting from "@/components/userProfile/ProfileSetting";
import AtlobhaPlusHint from "@/components/userProfile/atlobhaPlusHint";
import BasicSections from "@/components/userProfile/basicSections";
import UserBalanceHolder from "@/components/userProfile/userBalanceholder/userBalanceHolder";
import { USERS } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { useAuth } from "@/config/providers/AuthProvider";
import {
  setAllSections,
  setUserData,
} from "@/redux/reducers/quickSectionsProfile";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import Address from "../../public/icons/address-yellow.svg";
import Wallet from "../../public/icons/wallet-yellow.svg";
import Car from "../../public/icons/car-yellow.svg";
import Order from "../../public/icons/orders-yellow.svg";
import CarActive from "../../public/icons/active-car-new.svg";
import AddressActive from "../../public/icons/active-address-new.svg";
import OrderActive from "../../public/icons/active-order-new.svg";
import CardActive from "../../public/icons/cards-active-new.svg";
import YellowGift from "../../public/icons/yellow-gift.svg";
import Rate from "../../public/icons/rate.svg";
import Favourite from "../../public/icons/favourite.svg";
import Savety from "../../public/icons/savety.svg";
import HelpCenter from "../../public/icons/help-center.svg";
import CallUs from "../../public/icons/call-us.svg";
import Languages from "../../public/icons/languages.svg";
import Country from "../../public/icons/country.svg";
import SaudiaFlag from "../../public/icons/saudia-flag.svg";
import EnglishLang from "../../public/icons/lang-en.svg";
import ArabicLang from "../../public/icons/lang-ar.svg";
import LogoutIcon from "../../public/icons/logout-icon.svg";
import { logout } from "@/redux/reducers/authReducer";
import CommunicationSection from "@/components/userProfile/communicationSection";
import GuestMobileView from "./GuestMobileView";
import { isAuth } from "@/config/hooks/isAuth";

function UserProfile({ recallUserData = false }) {
  const router = useRouter();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();
  const { allsections } = useSelector((state) => state.quickSection);
  const boxShadowStyle =
    locale === "ar"
      ? "-2px -3px 8px rgba(0, 0, 0, 0.16)"
      : "2px -3px 8px 0px rgba(0, 0, 0, 0.16)";

  const profileSections = [
    ...(isAuth()
      ? [
          {
            iconSrc: <YellowGift />,
            text: t.tellFriends,
            hint: t.winPoints,
            //   onClick: () => alert("clicked"),
            path: "",
          },
          {
            iconSrc: <Rate />,
            text: t.rateAtlobha,
            //   onClick: () => alert("clicked"),
            path: "",
          },
          {
            iconSrc: <Favourite />,
            text: t.favouriteAtlobha,
            //   onClick: () => alert("clicked"),
            path: "",
          },
          {
            iconSrc: <Savety />,
            text: t.safety,
            //   onClick: () => alert("clicked"),
            path: "",
          },
          {
            iconSrc: <HelpCenter />,
            text: t.helpCenter,
            onClick: () => {
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
            },
            path: "",
          },
          {
            iconSrc: <CallUs />,
            text: t.callUs,
            //   onClick: () => alert("clicked"),
            path: "",
            hideArrow: true,
            hint: (
              <a href="tel:+966502670094">
                {locale == "en" && "+"}966502670094{locale == "ar" && "+"}
              </a>
            ),
          },
          {
            iconSrc: <Languages />,
            text: t.language,
            onClick: () => {
              webengage.track("LANGUAGE_SELECTED", {
                language: locale === "ar" ? "Arabic" : "English",
              });
              router
                .push(router.pathname, router.asPath, {
                  locale: locale === "ar" ? "en" : "ar",
                })
                .then(() => {
                  router.reload();
                });
            },
            hint: locale === "ar" ? <ArabicLang /> : <EnglishLang />,
            path: "",
          },
          {
            iconSrc: <Country />,
            text: t.country,
            //   onClick: () => alert("clicked"),
            hint: locale === "ar" ? <SaudiaFlag /> : <SaudiaFlag />,
            path: "",
          },
        ]
      : [
          {
            iconSrc: <Languages />,
            text: t.language,
            onClick: () => {
              webengage.track("LANGUAGE_SELECTED", {
                language: locale === "ar" ? "Arabic" : "English",
              });
              router
                .push(router.pathname, router.asPath, {
                  locale: locale === "ar" ? "en" : "ar",
                })
                .then(() => {
                  router.reload();
                });
            },
            hint: locale === "ar" ? <ArabicLang /> : <EnglishLang />,
            path: "",
          },
          {
            iconSrc: <HelpCenter />,
            text: t.helpCenter,
            onClick: () => {
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
            },
            path: "",
          },

          {
            iconSrc: <CallUs />,
            text: t.callUs,
            //   onClick: () => alert("clicked"),
            path: "",
            hideArrow: true,
            hint: (
              <a href="tel:+966502670094">
                {locale == "en" && "+"}966502670094{locale == "ar" && "+"}
              </a>
            ),
          },

          {
            iconSrc: <Rate />,
            text: t.rateAtlobha,
            //   onClick: () => alert("clicked"),
            path: "",
          },
        ]),
  ];

  const [quickSections, setQuickSections] = useState([
    {
      activeSrc: <OrderActive />,
      src: <Order />,
      title: t.myOrders,
      num: 0,
      onClick: () => router.push("/userProfile/myOrders"),
      path: "myOrders",
    },
    {
      activeSrc: <AddressActive />,
      src: <Address />,
      title: t.addresses,
      num: 0,
      onClick: () => router.push("/userProfile/myAddresses"),
      path: "myAddresses",
    },
    {
      src: <Wallet />,
      title: t.myCards,
      num: 0,
      path: "cards",
      activeSrc: <CardActive />,
    },
    {
      activeSrc: <CarActive />,
      src: <Car />,
      title: t.Cars,
      num: 0,
      onClick: () => router.push("/userProfile/myCars"),
      path: "myCars",
    },
  ]);

  const { data } = useCustomQuery({
    name: ["getProfileInfo", recallUserData],
    url: `${USERS}/${user?.data?.user?.id}`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    // staleTime: 5 * 60 * 1000,
    enabled: user?.data?.user?.id || recallUserData ? true : false,
    onSuccess: (res) => {
      dispatch(
        setUserData({
          data: res,
        })
      );
      dispatch(
        setAllSections({
          data: [
            {
              activeSrc: <OrderActive />,
              src: <Order />,
              title: t.myOrders,
              num: res?.order_count,
              path: "myOrders",
            },
            {
              activeSrc: <AddressActive />,
              src: <Address />,
              title: t.addresses,
              num: res?.addresses_count,
              path: "myAddresses",
            },
            {
              src: <Wallet />,
              title: t.myCards,
              num: 0,
              path: "cards",
              activeSrc: <CardActive />,
            },
            {
              activeSrc: <CarActive />,
              src: <Car />,
              title: t.Cars,
              num: res?.vehicles_count,
              path: "myCars",
            },
          ],
        })
      );
      setQuickSections([
        {
          activeSrc: <OrderActive />,
          src: <Order />,
          title: t.myOrders,
          num: res?.order_count,
          onClick: () => router.push("/userProfile/myOrders"),
          path: "myOrders",
        },
        {
          activeSrc: <AddressActive />,
          src: <Address />,
          title: t.addresses,
          num: res?.addresses_count,
          onClick: () => router.push("/userProfile/myAddresses"),
          path: "myAddresses",
        },
        {
          src: <Wallet />,
          title: t.myCards,
          num: 0,
          path: "wallet",
          activeSrc: <CardActive />,
        },
        {
          activeSrc: <CarActive />,
          src: <Car />,
          title: t.Cars,
          num: res?.vehicles_count,
          onClick: () => router.push("/userProfile/myCars"),
          path: "myCars",
        },
      ]);
      window.webengage.onReady(() => {
        webengage.user.setAttribute("total_cars", res?.vehicles_count || 0);
        webengage.user.setAttribute("total_orders", res?.order_count || 0);
      });
    },
    onError: () => {},
  });

  //   no profile page in web must be has active child
  //   useEffect(() => {
  //     if (!isMobile && router.pathname === "/userProfile" && isAuth()) {
  //       router.push("/userProfile/editInfo/");
  //     }
  //   }, [isMobile]);

  return isAuth() ? (
    <>
      <Box
        sx={{
          // -2px -3px 8px rgba(0, 0, 0, 0.16)
          boxShadow: boxShadowStyle,
        }}
        className="col-12  pb-0 p-3"
      >
        <Box sx={{ position: "absolute", top: "0px", visibility: "hidden" }}>
          <BreadCrumb />
        </Box>

        <UserBalanceHolder data={data} />
        <div className="row mt-3">
          {(allsections?.length ? allsections : quickSections)?.map(
            (sec, index) => (
              <div key={sec?.title} className="col-6 col-lg-6 col-md-12 ">
                <BasicSections
                  src={sec?.src}
                  activeSrc={sec?.activeSrc}
                  title={sec?.title}
                  num={sec?.num}
                  onClick={quickSections[index]?.onClick}
                  path={sec?.path}
                />
              </div>
            )
          )}
        </div>
        <div className="row mt-3">
          {profileSections?.map((data, index) => (
            <Box className="col-md-12" key={`${data?.text}${index}`}>
              <ProfileSetting data={data} />
            </Box>
          ))}
          <Box
            sx={{
              padding: "20px 0px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              marginBottom: "10px",
              "&:hover": {
                backgroundColor: "#f7f7f7e0",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              },
            }}
            onClick={() => {
              router.push("/");
              setTimeout(() => {
                dispatch(logout());
              }, 500);
            }}
            className="col-md-12"
          >
            <LogoutIcon /> {t.logout}
          </Box>

          {/* <div className="col-12 mb-3">
            <AtlobhaPlusHint />
          </div> */}

          <CommunicationSection />
        </div>
      </Box>
    </>
  ) : (
    <GuestMobileView
      profileSections={profileSections}
      boxShadowStyle={boxShadowStyle}
    />
  );
}

export default UserProfile;
