import React from "react";
import { Box, Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import useLocalization from "@/config/hooks/useLocalization";
import Image from "next/image";
import ServiceCenterInstallment from "../ProductDetails/ServiceCenterInstallment";
import useScreenSize from "@/constants/screenSize/useScreenSize";

function BasketItemStatus({
  data,
  setActiveServiceCenter,
  activeServiceCenter,
  handleRedirectToProdDetails,
}) {
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();

  // If inactive product
  if (!data?.product?.is_active) {
    return (
      <Box
        sx={{
          padding: isMobile ? "4px 6px" : "4px 10px",
          background: "rgba(224, 110, 14, 0.10)",
          color: "#E06E0E",
          fontWeight: "500",
          width: "fit-content",
          borderRadius: "8px",
          fontSize: isMobile ? "11px" : "12px",
          display: "flex",
          alignItems: "center",
          position: "absolute",
          bottom: "-14px",
          ...(locale === "ar"
            ? { right: isMobile ? "20px" : "45px" }
            : { left: isMobile ? "20px" : "45px" }),
          opacity: "0.7",
        }}
      >
        <ErrorIcon
          sx={{
            fill: "#E06E0E",
            marginInlineEnd: "5px",
            fontSize: isMobile ? "15px" : "18px",
          }}
        />
        <Box>{t.notFoundInBasket}</Box>
      </Box>
    );
  }

  // If service center install required
  if (data?.product?.marketplace_category?.installed_in_service_center) {
    return (
      <Box
        sx={{
          padding: isMobile ? "4px 6px" : "4px 10px",
          fontWeight: "500",
          width: "fit-content",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          position: "absolute",
          bottom: "-18px",
          ...(locale === "ar"
            ? { right: isMobile ? "10px" : "45px" }
            : { left: isMobile ? "10px" : "45px" }),
          cursor: "pointer",
        }}
      >
        <Box
          sx={{
            padding: "0px 4px",
            borderRadius: "4px",
            background: "#EE772F",
            color: "white",
            fontWeight: "500",
            fontSize: isMobile ? "11px" : "13px",
            cursor: "pointer",
            marginInlineEnd: "10px",
          }}
          onClick={() => handleRedirectToProdDetails(data)}
        >
          <Image
            src="/icons/gear-install.svg"
            alt="gear"
            width={12}
            height={12}
            style={{ marginInlineEnd: "2px" }}
          />
          {t.mandatoryInstall}
        </Box>

        <Typography
          component="span"
          sx={{
            color: "#429DF8",
            fontWeight: "500",
            fontSize: isMobile ? "11px" : "13px",
            "&:hover": { textDecoration: "underline" },
          }}
          onClick={() => setActiveServiceCenter(data?.product)}
        >
          {t.showServiceCenters}
        </Typography>

        <ServiceCenterInstallment
          hideTitleDesign
          prod={activeServiceCenter}
          triggerFromParent
          open={activeServiceCenter?.id === data?.product?.id}
          setOpen={(val) => !val && setActiveServiceCenter(null)}
        />
      </Box>
    );
  }

  return null;
}

export default BasketItemStatus;
