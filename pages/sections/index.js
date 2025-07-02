import ComingSoon from "@/components/comingSoon";
import MetaTags from "@/components/shared/MetaTags";
import useLocalization from "@/config/hooks/useLocalization";
import { Box } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

function Sections() {
  const { t, locale } = useLocalization();
  const router = useRouter();
  const { secTitle, secType } = router.query;
  const { sectionsSeo } = useSelector((state) => state.homeSectionsData);

  useEffect(() => {
    if (secType === "maintenance-reservation") {
      window.webengage.onReady(() => {
        webengage.track("PERIODIC_MAITAINCE_VIEWED", {
          event_status: true,
        });
      });
    }
    if (secType === "najm-and-estimation") {
      window.webengage.onReady(() => {
        webengage.track("TAQDEER_SERVICE_VIEWED", {
          event_status: true,
        });
      });
    }
  }, [secType]);

  const renderMetaTagsDependOnSecType = () => {
    const selectedSection = sectionsSeo?.find((d) => d?.type === secType)?.seo;
    if (!selectedSection || !["test-drive", "services"].includes(secType))
      return null;

    const title =
      locale === "en"
        ? `Atlobha- ${selectedSection?.title_en}`
        : `اطلبها- ${selectedSection?.title_ar}`;

    const description =
      selectedSection?.meta_description || selectedSection?.top_description;

    const image = selectedSection?.image_alt;

    const keywords = selectedSection?.keywords?.join(", ");

    return (
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta name="twitter:description" content={description} />
        <meta property="og:image" content={image} />
        <meta name="twitter:image" content={image} />
        <meta name="keywords" content={keywords} />
      </Head>
    );
  };

  return (
    <Box>
      <MetaTags title={secTitle} content={secType} />
      {renderMetaTagsDependOnSecType()}
      <ComingSoon />
    </Box>
  );
}

export default Sections;
