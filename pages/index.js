import Head from "next/head";
import Image from "next/image";
import localFont from "next/font/local";
import MetaTags from "@/components/shared/MetaTags";
import SharedBtn from "@/components/shared/SharedBtn";
import IconInsideCircle from "@/components/IconInsideCircle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Box } from "@mui/material";
import SharedInput from "@/components/shared/SharedInput";
import Grid from "@mui/material/Grid2";
import QuickChoose from "@/components/QuickChoose";
import MainCarousel from "@/components/MainCarousel";
import ColoredHint from "@/components/ColoredHint";
import Categories from "@/components/Categories";
import ProductCard from "@/components/shared/ProductCard";
import ComingSoon from "@/components/comingSoon";
import { useEffect } from "react";
import useDeepLink from "@/config/hooks/useDeepLink";
import useBranch from "./useBranch";

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
  const deepLinkData = useBranch();
  const style = {
    marginTop: "32px",
  };

  useEffect(() => {
    window.webengage.onReady(() => {
      webengage.track("APP_SECTION_VIEWED", {
        app_section: "Home",
      });
    });
  }, []);
//   console.log("deepLinkData from index page", deepLinkData);

  return (
    <Box
    //   sx={{
    //     display: "flex",
    //   }}
    >
      <MetaTags title="طلبات المتجر" content="طلبات المتجر" />
      {/* <div className="container mb-5 pb-5">
        <div className="row" style={style}>
          <div className="col-12">
            <QuickChoose />
          </div>
        </div>
        <div className="row" style={style}>
          <div className="col-12">
            <MainCarousel />
          </div>
        </div>
        <div className="row" style={style}>
          <div className="col-12">
            <ColoredHint />
          </div>
        </div>
        <div className="row" style={style}>
          <div className="col-12">
            <Categories />
          </div>
        </div>

        <div className="row" style={style}>
          <div className="col-12  d-flex gap-5">
            <ProductCard />
            <ProductCard imgPath="/imgs/no-prod-img.svg" hasNum={true} />
          </div>
        </div>
      </div> */}

      {/* <SharedBtn />
      <LanguageSwitcher />
      <IconInsideCircle
        hasText={"info"}
        width="90px"
        height="90px"
        imgHeight="42"
        imgWidth="42"
        iconUrl="/icons/free-delivery.svg"
      />
      <IconInsideCircle hasText={false} />
      <IconInsideCircle hasText={false} />
      <IconInsideCircle hasText={false} />
      <IconInsideCircle hasText={false} />
      <IconInsideCircle hasText={false} />
      <IconInsideCircle hasText={false} />
      <IconInsideCircle hasText={false} />
      <IconInsideCircle hasText={false} />
      <SharedInput /> */}
      <ComingSoon />
	  
    </Box>
  );
}
