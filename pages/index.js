import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import useBranch from "./useBranch";
import useCustomQuery from "@/config/network/Apiconfig";
import { useDispatch, useSelector } from "react-redux";
import { APP_SECTIONS, HOME_SECTIONS } from "@/config/endPoints/endPoints";
import { MARKETPLACE } from "@/constants/enums";
import { setAllHomeSections } from "@/redux/reducers/homeSectionsReducer";
import useLocalization from "@/config/hooks/useLocalization";
import QuickLinks from "@/components/Marketplace/QuickLinks";
import MainCarousel from "@/components/Marketplace/MainCarousel";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import HintPricedParts from "@/components/Marketplace/NotificationsHints/HintPricedParts";
import CategoriesMarketplace from "@/components/Marketplace/CategoriesMarketplace";
import BoughtAgain from "@/components/Marketplace/BoughtAgain";
import PackageOffers from "@/components/Marketplace/PackageOffers";
import ManufactureShell from "@/components/Marketplace/Manufacturers/ManufactureShell";
import CategoriesProducts from "@/components/Marketplace/CategoriesProducts/CategoriesProducts";
import RecentlyViewed from "@/components/Marketplace/RecentlyViewed";
import AtlobhaPartners from "@/components/Marketplace/AtlobhaPartners";
import { isAuth } from "@/config/hooks/isAuth";
import Head from "next/head";
import CategoriesServices from "@/components/sectionsInfo/services/CategoriesServices";
import SponserAds from "@/components/Marketplace/SponserAds";
import FindMoreSegments from "@/components/Marketplace/FindMoreSegments";

export default function Home() {
  // useBranch user for deep  links
  useBranch();
  const { isMobile } = useScreenSize();
  const dispatch = useDispatch();
  const { t, locale } = useLocalization();
  const { allGroups } = useSelector((state) => state.appGroups);
  const { allhomeSections, sectionsSeo } = useSelector(
    (state) => state.homeSectionsData
  );
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );
  const { data, isLoading } = useCustomQuery({
    name: ["app-home-sections", allGroups?.length, isAuth()],
    url: `${APP_SECTIONS}/${
      allGroups[0]?.sections?.find((sec) => sec?.type === MARKETPLACE)?.id
    }${HOME_SECTIONS}`,
    refetchOnWindowFocus: false,
    enabled: allGroups?.length ? true : false,
    select: (res) =>
      res?.data?.data
        ?.sort((a, b) => a.position - b.position)
        ?.filter((d) => d?.is_active),
    onSuccess: (res) => {
      dispatch(setAllHomeSections(res));
    },
  });

  useEffect(() => {
    window.webengage.onReady(() => {
      webengage.track("APP_SECTION_VIEWED", {
        app_section: "Home",
      });
    });
  }, []);

  return isLoading ? (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <CircularProgress
        size={60}
        sx={{
          color: "#FFD400",
          mt: 5,
        }}
      />
    </Box>
  ) : (
    <>
      {!!sectionsSeo?.length && (
        <Head>
          <title>
            {locale === "en"
              ? `Atlobha- ${
                  sectionsSeo?.find((d) => d?.type === MARKETPLACE)?.seo
                    ?.title_en
                }`
              : `اطلبها- ${
                  sectionsSeo?.find((d) => d?.type === MARKETPLACE)?.seo
                    ?.title_ar
                }`}
          </title>
          <meta
            name="description"
            content={
              sectionsSeo?.find((d) => d?.type === MARKETPLACE)?.seo
                ?.meta_description
            }
          />
          <meta
            property="og:description"
            content={
              sectionsSeo?.find((d) => d?.type === MARKETPLACE)?.seo
                ?.meta_description ||
              sectionsSeo?.find((d) => d?.type === MARKETPLACE)?.seo
                ?.top_description
            }
          />
          <meta
            name="twitter:description"
            content={
              sectionsSeo?.find((d) => d?.type === MARKETPLACE)?.seo
                ?.meta_description ||
              sectionsSeo?.find((d) => d?.type === MARKETPLACE)?.seo
                ?.top_description
            }
          />
          <meta
            property="og:image"
            content={
              sectionsSeo?.find((d) => d?.type === MARKETPLACE)?.seo?.image_alt
            }
          />
          <meta
            name="twitter:image"
            content={
              sectionsSeo?.find((d) => d?.type === MARKETPLACE)?.seo?.image_alt
            }
          />
          <meta
            name="keywords"
            content={sectionsSeo
              ?.find((d) => d?.type === MARKETPLACE)
              ?.keywords?.join(", ")}
          />
        </Head>
      )}
      {data?.map((item) => {
        switch (item.type) {
          case "quick-links":
            return (
              <div className="container" key={item?.id}>
                <div className="row">
                  <div className={`col-12 ${isMobile ? "mt-3" : "mt-5"}`}>
                    <QuickLinks sectionInfo={item} />
                  </div>
                </div>
              </div>
            );
          case "ads":
            return (
              <div className="container mb-3">
                <div className="row">
                  <div className={`col-12 ${isMobile ? "mt-3" : "mt-5"}`}>
                    <MainCarousel sectionInfo={item} />
                  </div>
                </div>
              </div>
            );

          case "sponsor_ad":
            return (
              <div className="container mb-3">
                <div className="row">
                  <div className={`col-12 ${isMobile ? "mt-3  px-0" : "mt-5"}`}>
                    <SponserAds sectionInfo={item} />
                  </div>
                </div>
              </div>
            );

          //   case "notifications":
          //     return (
          //       <div className="container" key={item?.id}>
          //         <div className="row">
          //           <div className={`col-12 ${isMobile ? "mt-3" : "mt-5"}`}>
          //             <HintPricedParts sectionInfo={item} />{" "}
          //           </div>
          //         </div>
          //       </div>
          //     );
          case "marketplace-categories":
            if (
              (item?.requires_authentication && isAuth()) ||
              !item?.requires_authentication
            ) {
              return (
                <div className="container" key={item?.id}>
                  <div className="row">
                    <div className={`col-12 ${isMobile ? "mt-3  px-0" : "mt-5"}`}>
                      <CategoriesMarketplace sectionInfo={item} />
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          case "buy-it-again":
            return (
              <div className="container" key={item?.id}>
                <div className="row">
                  <div className={`col-12 ${isMobile ? "mt-3 px-0" : "mt-5"}`}>
                    <BoughtAgain sectionInfo={item} />
                  </div>
                </div>
              </div>
            );
          case "featured-products":
            return (
              <div className="container" key={item?.id}>
                <div className="row">
                  <div
                    className={`col-12 ${isMobile ? "mt-3 mb-1 px-0" : "mt-5"}`}
                  >
                    <PackageOffers sectionInfo={item} />
                  </div>
                </div>
              </div>
            );
          case "segments":
            return (
              <div className="container" key={item?.id}>
                <div className="row">
                  <div className={`col-12 ${isMobile ? "mt-3 mb-1 px-0" : "mt-5"}`}>
                    <FindMoreSegments sectionInfo={item} />
                  </div>
                </div>
              </div>
            );
          case "marketplace-category":
            return (
              <div className="container" key={item?.id}>
                <div className="row">
                  <div className={`col-12 ${isMobile ? "mt-3 px-0" : "mt-5"}`}>
                    <CategoriesProducts sectionInfo={item} />
                  </div>{" "}
                </div>
              </div>
            );

          case "service-categories":
            if (
              (item?.requires_authentication && isAuth()) ||
              !item?.requires_authentication
            ) {
              return (
                <>
                  <div className="container" key={item?.id}>
                    <div className="row">
                      <div className={`col-12 ${isMobile ? "mt-3 px-0" : "mt-5"}`}>
                        <CategoriesServices sectionInfo={item} />
                      </div>
                    </div>
                  </div>
                </>
              );
            }
            return null;

          case "manufacturer":
            return (
              <div className={`${isMobile ? "" : "container"}`} key={item?.id}>
                <div className={`${isMobile ? "" : "row"}`}>
                  <div
                    className={`col-12 ${isMobile ? "mt-3 px-0" : "mt-5"}`}
                    key={item?.id}
                  >
                    <ManufactureShell sectionInfo={item} />
                  </div>
                </div>
              </div>
            );
          case "recently-viewed":
            return (
              <div className="container" key={item?.id}>
                <div className="row">
                  <div className={`col-12 ${isMobile ? "mt-3" : "mt-5"}`}>
                    <RecentlyViewed sectionInfo={item} />
                  </div>
                </div>
              </div>
            );
          case "manufacturers":
            return (
              <div className="container" key={item?.id}>
                <div className="row">
                  <div className={`col-12 ${isMobile ? "mt-3 px-0" : "mt-5"}`}>
                    <AtlobhaPartners sectionInfo={item} />
                  </div>
                </div>
              </div>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
