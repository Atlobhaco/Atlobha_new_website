import localFont from "next/font/local";
import MetaTags from "@/components/shared/MetaTags";
import { Box, CircularProgress } from "@mui/material";
import { useEffect } from "react";
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
import HintPricedParts from "@/components/Marketplace/HintPricedParts";
import CategoriesMarketplace from "@/components/Marketplace/CategoriesMarketplace";
import BoughtAgain from "@/components/Marketplace/BoughtAgain";
import PackageOffers from "@/components/Marketplace/PackageOffers";
import ManufactureShell from "@/components/Marketplace/Manufacturers/ManufactureShell";
import CategoriesProducts from "@/components/Marketplace/CategoriesProducts/CategoriesProducts";
import RecentlyViewed from "@/components/Marketplace/RecentlyViewed";
import AtlobhaPartners from "@/components/Marketplace/AtlobhaPartners";
import PartsImages from "@/components/spareParts/PartsImages";
import { isAuth } from "@/config/hooks/isAuth";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  useBranch();
  const { isMobile } = useScreenSize();

  const dispatch = useDispatch();
  const { t } = useLocalization();
  const { allGroups } = useSelector((state) => state.appGroups);
  const { allhomeSections } = useSelector((state) => state.homeSectionsData);

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
      <MetaTags title={t.marketplace} content={t.marketplace} />
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
              <div className="container" key={item?.id}>
                <div className="row">
                  <div className={`col-12 ${isMobile ? "mt-3" : "mt-5"}`}>
                    <MainCarousel sectionInfo={item} />
                  </div>
                </div>
              </div>
            );
          case "notifications":
            return (
              <div className="container" key={item?.id}>
                <div className="row">
                  <div className={`col-12 ${isMobile ? "mt-3" : "mt-5"}`}>
                    <HintPricedParts sectionInfo={item} />{" "}
                  </div>
                </div>
              </div>
            );
          case "marketplace-categories":
            return (
              <div className="container" key={item?.id}>
                <div className="row">
                  <div className={`col-12 ${isMobile ? "mt-3" : "mt-5"}`}>
                    <CategoriesMarketplace sectionInfo={item} />
                  </div>
                </div>
              </div>
            );
          case "buy-it-again":
            return (
              <div className="container" key={item?.id}>
                <div className="row">
                  <div className={`col-12 ${isMobile ? "mt-3" : "mt-5"}`}>
                    <BoughtAgain sectionInfo={item} />
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
          case "marketplace-category":
            return (
              <div className="container" key={item?.id}>
                <div className="row">
                  <div className={`col-12 ${isMobile ? "mt-3" : "mt-5"}`}>
                    <CategoriesProducts sectionInfo={item} />
                  </div>{" "}
                </div>
              </div>
            );
          case "manufacturer":
            return (
              <div className={`${isMobile ? "" : "container"}`} key={item?.id}>
                <div className={`${isMobile ? "" : "row"}`}>
                  <div
                    className={`col-12 ${isMobile ? "mt-3" : "mt-5"}`}
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
                  <div className={`col-12 ${isMobile ? "mt-3" : "mt-5"}`}>
                    <AtlobhaPartners sectionInfo={item} />
                  </div>
                </div>
              </div>
            );
          default:
            return null;
        }
      })}

      {/* <ComingSoon /> */}
    </>
  );
}
