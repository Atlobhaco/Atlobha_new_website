import { APP_SECTIONS, HOME_SECTIONS } from "@/config/endPoints/endPoints";
import { isAuth } from "@/config/hooks/isAuth";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress } from "@mui/material";
import Head from "next/head";
import QuickLinks from "../../Marketplace/QuickLinks";
import MainCarousel from "../../Marketplace/MainCarousel";
import CategoriesServices from "./CategoriesServices";
import StaticDynamicSections from "./StaticDynamicSections";
import RecentlyViewedServices from "./RecentlyViewedServices";
import BoughtAgainServices from "./BoughtAgainSerivces";
import PackageOffers from "@/components/Marketplace/PackageOffers";

function Services() {
  const router = useRouter();
  const { secTitle, secType } = router.query;
  const { isMobile } = useScreenSize();
  const dispatch = useDispatch();
  const { t, locale } = useLocalization();
  const { allGroups } = useSelector((state) => state.appGroups);
  const { sectionsSeo } = useSelector((state) => state.homeSectionsData);
  const [hasAds, setHasAds] = useState(false);
  const [hasQuickLinks, setHasQuickLinks] = useState(false);

  const { data: sections, isLoading } = useCustomQuery({
    name: ["app-home-sections-service", allGroups?.length, secType, isAuth()],
    url: `${APP_SECTIONS}/${
      allGroups[1]?.sections?.find((sec) => sec?.type === secType)?.id
    }${HOME_SECTIONS}`,
    refetchOnWindowFocus: false,
    enabled: allGroups?.length && secType ? true : false,
    select: (res) => {
      // Filter only active items and sort them
      const sorted = (res?.data?.data || [])
        .filter((d) => d?.is_active)
        .sort((a, b) => a.position - b.position);

      // Create the new object you want to insert
      const newSection = {
        id: "static-1",
        type: "static-dynamic-section",
        position: 3,
        is_active: true,
        requires_authentication: false,
        title: t.serviceCategories,
        // you can add other properties needed for your frontend
      };

      // Insert at index 2 (which is position 3)
      sorted.splice(2, 0, newSection);
      // Recalculate positions so they remain sequential
      return sorted.map((item, index) => ({
        ...item,
        position: index + 1,
      }));
    },
    onSuccess: (res) => {
      if (isAuth()) {
        setHasQuickLinks(true);
      }
    },
  });

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
      {sectionsSeo?.length && (
        <Head>
          <title>
            {locale === "en"
              ? `Atlobha- ${
                  sectionsSeo?.find((d) => d?.type === secType)?.seo?.title_en
                }`
              : `اطلبها- ${
                  sectionsSeo?.find((d) => d?.type === secType)?.seo?.title_ar
                }`}
          </title>
          <meta
            name="description"
            content={
              sectionsSeo?.find((d) => d?.type === secType)?.seo
                ?.meta_description
            }
          />
          <meta
            property="og:description"
            content={
              sectionsSeo?.find((d) => d?.type === secType)?.seo
                ?.meta_description ||
              sectionsSeo?.find((d) => d?.type === secType)?.seo
                ?.top_description
            }
          />
          <meta
            name="twitter:description"
            content={
              sectionsSeo?.find((d) => d?.type === secType)?.seo
                ?.meta_description ||
              sectionsSeo?.find((d) => d?.type === secType)?.seo
                ?.top_description
            }
          />
          <meta
            property="og:image"
            content={
              sectionsSeo?.find((d) => d?.type === secType)?.seo?.image_alt
            }
          />
          <meta
            name="twitter:image"
            content={
              sectionsSeo?.find((d) => d?.type === secType)?.seo?.image_alt
            }
          />
          <meta
            name="keywords"
            content={sectionsSeo
              ?.find((d) => d?.type === secType)
              ?.keywords?.join(", ")}
          />
        </Head>
      )}
      {sections?.map((item) => {
        switch (item.type) {
          case "quick-links":
            return (
              <div
                className="container"
                key={item?.id}
                style={{
                  display: hasQuickLinks ? "block" : "none",
                }}
              >
                <div className="row">
                  <div className={`col-12 ${isMobile ? "mt-3" : "mt-5"}`}>
                    <QuickLinks
                      sectionInfo={{ ...item, requires_authentication: true }}
                      setHasQuickLinks={setHasQuickLinks}
                    />
                  </div>
                </div>
              </div>
            );
          case "ads":
            return (
              <div
                key={item?.id}
                className="container mb-3"
                style={{
                  display: hasAds ? "block" : "none",
                }}
              >
                <div className="row">
                  <div className={`col-12 ${isMobile ? "mt-3" : "mt-5"}`}>
                    <MainCarousel sectionInfo={item} setHasAds={setHasAds} />
                  </div>
                </div>
              </div>
            );

          //   //   case "notifications":
          //   //     return (
          //   //       <div className="container" key={item?.id}>
          //   //         <div className="row">
          //   //           <div className={`col-12 ${isMobile ? "mt-3" : "mt-5"}`}>
          //   //             <HintPricedParts sectionInfo={item} />{" "}
          //   //           </div>
          //   //         </div>
          //   //       </div>
          //   //     );

          case "static-dynamic-section":
            return (
              <div className="container mb-3">
                <div className="row">
                  <div className={`col-12 ${isMobile ? "mt-3" : "mt-5"}`}>
                    <StaticDynamicSections sectionInfo={item} />
                  </div>
                </div>
              </div>
            );

          case "service-categories":
            if (
              (item?.requires_authentication && isAuth()) ||
              !item?.requires_authentication
            ) {
              return (
                <div className="container" key={item?.id}>
                  <div className="row">
                    <div className={`col-12 ${isMobile ? "mt-3" : "mt-5"}`}>
                      <CategoriesServices sectionInfo={item} />
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
                  <div className={`col-12 ${isMobile ? "mt-3" : "mt-5"}`}>
                    <BoughtAgainServices sectionInfo={item} />
                  </div>
                </div>
              </div>
            );

          case "featured-products":
            return (
              <div className="container" key={item?.id}>
                <div className="row">
                  <div className={`col-12 ${isMobile ? "mt-3 mb-1" : "mt-5"}`}>
                    <PackageOffers sectionInfo={item} />
                  </div>
                </div>
              </div>
            );

          //   case "manufacturer":
          //     return (
          //       <div className={`${isMobile ? "" : "container"}`} key={item?.id}>
          //         <div className={`${isMobile ? "" : "row"}`}>
          //           <div
          //             className={`col-12 ${isMobile ? "mt-3" : "mt-5"}`}
          //             key={item?.id}
          //           >
          //             <ManufactureShell sectionInfo={item} />
          //           </div>
          //         </div>
          //       </div>
          //     );
          case "recently-viewed":
            return (
              <div className="container" key={item?.id}>
                <div className="row">
                  <div className={`col-12 ${isMobile ? "mt-3" : "mt-5"}`}>
                    <RecentlyViewedServices sectionInfo={item} />
                  </div>
                </div>
              </div>
            );
          //   case "manufacturers":
          //     return (
          //       <div className="container" key={item?.id}>
          //         <div className="row">
          //           <div className={`col-12 ${isMobile ? "mt-3" : "mt-5"}`}>
          //             <AtlobhaPartners sectionInfo={item} />
          //           </div>
          //         </div>
          //       </div>
          //     );
          default:
            return null;
        }
      })}
    </>
  );
}

export default Services;
