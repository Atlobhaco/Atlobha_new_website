import useLocalization from "@/config/hooks/useLocalization";
import React, { useState } from "react";
import DialogCentered from "@/components/DialogCentered";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import HowMakePrice from "@/components/spareParts/HowMakePrice";
import { Box } from "@mui/material";
import SharedBtn from "@/components/shared/SharedBtn";
import Questions from "@/components/userProfile/commonQuestions";
import CarPricingContent from "@/pages/carPricing/CarPricingContent";
import TermsCarPricingContent from "@/components/userProfile/termsCarPricingContent";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

function CarPricing() {
  const router = useRouter();
  const { secType } = router.query;
  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();
  const [openTerms, setOpenTerms] = useState(false);
  const [openHowPricing, setOpenhowPricing] = useState(false);
  const [openCommonQuestions, setOpenCommonnquestions] = useState(false);
  const { sectionsSeo } = useSelector((state) => state.homeSectionsData);

  return (
    <>
      {!!sectionsSeo?.length && (
        <Head>
          <title>
            {locale === "en"
              ? `Atlobha- ${
                  sectionsSeo?.find((d) => d?.type === secType)?.title_en
                }`
              : `اطلبها- ${
                  sectionsSeo?.find((d) => d?.type === secType)?.title_ar
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
              sectionsSeo?.find((d) => d?.type === secType)?.description_ar ||
              sectionsSeo?.find((d) => d?.type === secType)?.description_en
            }
          />
          <meta
            name="twitter:description"
            content={
              sectionsSeo?.find((d) => d?.type === secType)?.description_ar ||
              sectionsSeo?.find((d) => d?.type === secType)?.description_en
            }
          />
          <meta
            property="og:image"
            content={sectionsSeo?.find((d) => d?.type === secType)?.image}
          />
          <meta
            name="twitter:image"
            content={sectionsSeo?.find((d) => d?.type === secType)?.image}
          />
          <meta
            name="keywords"
            content={sectionsSeo
              ?.find((d) => d?.type === secType)
              ?.keywords?.join(", ")}
          />
        </Head>
      )}

      <CarPricingContent
        setOpenhowPricing={setOpenhowPricing}
        setOpenTerms={setOpenTerms}
        openTerms={openTerms}
      />

      {/* popup for how to make price */}
      <DialogCentered
        showTitle={null}
        open={openHowPricing}
        setOpen={setOpenhowPricing}
        hasCloseIcon
        customClass={!isMobile ? "sm-popup-width" : ""}
        content={
          <Box
            sx={{
              overflow: "auto",
              maxHeight: "80vh",
            }}
          >
            <HowMakePrice
              setOpenhowPricing={setOpenhowPricing}
              heading={t.whatCarPricing}
              imgSrc="/icons/money.svg"
              infoSteps={[t.chooseCar, t.checkOffers, t.chooseOffer]}
              infoImgArray={[
                { src: "/imgs/choose-car.svg", alt: "Slide 1" },
                { src: "/imgs/check-offer.svg", alt: "Slide 2" },
                { src: "/imgs/select-offer.svg", alt: "Slide 3" },
              ]}
              customFooter={
                <>
                  <Box
                    sx={{
                      margin: "40px 0px 20px 0px",
                      textAlign: "center",
                      color: "#6B7280",
                      fontSize: "16px",
                      fontWeight: "500",
                    }}
                  >
                    {t.AtlobhaBringIt}
                  </Box>
                  <SharedBtn
                    className="outline-btn"
                    customClass="w-100 mb-3"
                    text="commonQuestions"
                    onClick={() => {
                      setOpenhowPricing(false);
                      setOpenCommonnquestions(true);
                    }}
                  />
                  <Box>
                    <SharedBtn
                      className="big-main-btn"
                      customClass="w-100"
                      text="tryServiceNow"
                      onClick={() => setOpenhowPricing(false)}
                    />
                  </Box>
                </>
              }
            />
          </Box>
        }
      />

      {/* popup for common questions */}
      <DialogCentered
        showTitle={true}
        title={t.commonQuestions}
        open={openCommonQuestions}
        setOpen={setOpenCommonnquestions}
        hasCloseIcon
        content={
          <Box
            sx={{
              maxHeight: "70vh",
              overflow: "hidden auto",
            }}
          >
            <Questions />
          </Box>
        }
      />
    </>
  );
}

export default CarPricing;
