import useLocalization from "@/config/hooks/useLocalization";
import { Box, Divider } from "@mui/material";
import Image from "next/image";
import React from "react";

function CompatibleWith({ prod }) {
  const { t, locale } = useLocalization();
  return (
    <Box>
      <Divider
        sx={{
          background: "#EAECF0",
          my: 1,
          height: "5px",
          borderBottomWidth: "0px",
        }}
      />
      <Box
        sx={{
          fontSize: "18px",
          fontWeight: "700",
          mb: 1,
        }}
      >
        {t.compatibleWith}
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <Image
          src={
            prod?.vehicle_brand?.image ||
            prod?.model?.vehicle_brand?.image ||
            "/imgs/no-prod-img.svg"
          }
          alt="model"
          width={80}
          height={80}
          onError={(e) => (e.target.srcset = "/imgs/no-prod-img.svg")}
          style={{
            width: "auto",
            height: "auto",
            maxWidth: "80px",
            maxHeight: "80px",
            borderRadius: "10px",
          }}
          loading="lazy"
        />
        <Box
          sx={{
            fontWeight: "500",
            fontSize: "16px",
            textAlign: "center",
          }}
        >
          {prod?.brand?.name || locale === "ar"
            ? prod?.vehicle_brand?.name_ar
            : prod?.vehicle_brand?.name_en}
          <br />
          {prod?.model?.name || locale === "ar"
            ? prod?.vehicle_model?.name_ar
            : prod?.vehicle_model?.name_en}
        </Box>
        <Box
          sx={{
            fontWeight: "500",
            fontSize: "16px",
          }}
        >
          {prod?.year_from ? `${prod?.year_from} - ` : null} {prod?.year_to}
        </Box>
      </Box>
    </Box>
  );
}

export default CompatibleWith;
