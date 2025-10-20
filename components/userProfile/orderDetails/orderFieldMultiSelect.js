import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { useSelector } from "react-redux";
import { SERVICES } from "@/constants/enums";

function OrderFieldMultiSelect({ checkoutField }) {
  const { locale } = useLocalization();
  const { isMobile } = useScreenSize();
  const { allGroups } = useSelector((state) => state.appGroups);

  const bgColor =
    allGroups
      ?.map((data) => data?.sections)
      ?.flat()
      ?.find((d) => d?.type === SERVICES)?.background_color || "#E7F5FF";

  return (
    <Box
      sx={{
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          my: 1,
        }}
      >
        <InfoOutlinedIcon
          sx={{
            width: "25px",
            height: "25px",
            color: "#FFD400",
            ...(locale === "ar" ? { ml: 1 } : { mr: 1 }),
          }}
        />
        <Box
          sx={{
            color: "#232323",
            fontSize: isMobile ? "14px" : "20px",
            fontWeight: "700",
          }}
        >
          {checkoutField?.title}{" "}
        </Box>
      </Box>
      <Box
        sx={{
          mb: 1,
          width: "140px",
          minWidth: "115px",
          height: "130px",
          background: bgColor,
          display: "flex",
          flexDirection: "column",
          borderRadius: "8px",
          padding: "10px 7px 11px 8px",
          justifyContent: "space-between",
          flexShrink: 0, // 👈 this is the fix
          border: "2px solid #FFD400",
        }}
      >
        <Box
          sx={{
            fontSize: "15px",
            fontWeight: "500",
            color: "#232323",
            whiteSpace: "nowrap",
            overflow: "clip",
            textOverflow: "ellipsis",
            maxWidth: "100%",
          }}
        >
          {checkoutField?.selected_options[0].title}
        </Box>
        {checkoutField?.selected_options[0].image?.url && (
          <Image
            alt={checkoutField?.selected_options[0].id}
            src={checkoutField?.selected_options[0].image.url}
            width={100}
            height={60}
            style={{
              height: "auto",
              maxHeight: "100%",
              width: "auto",
              maxWidth: "max-content",
            }}
          />
        )}
      </Box>
    </Box>
  );
}

export default OrderFieldMultiSelect;
