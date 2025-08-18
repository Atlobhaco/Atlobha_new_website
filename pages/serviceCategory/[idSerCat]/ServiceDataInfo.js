import { riyalImgRed } from "@/constants/helpers";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

function ServiceDataInfo({ product }) {
  const { isMobile } = useScreenSize();
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        gap: "10px",
        padding: isMobile ? "8px 18px" : "16px 20px",
        background: "#FFF",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
        "&: hover": {
          opacity: "0.9",
          boxShadow: "inset 0px 0px 1px 1px rgba(18, 26, 43, 0.05)",
          borderRadius: "8px",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <Box
          sx={{
            width: isMobile ? "50px" : "80px",
            height: isMobile ? "50px" : "80px",
            display: "flex",
          }}
        >
          <Image
            loading="lazy"
            src={product?.thumbnail?.url || "/imgs/no-prod-img.svg"}
            alt="Product"
            width={200}
            height={200}
            onError={(e) => (e.target.srcset = "/imgs/no-prod-img.svg")} // Fallback to default image
            style={{
              width: "auto",
              height: "auto",
              maxWidth: "100%",
              maxHeight: "100%",
              borderRadius: "8px",
              margin: "auto",
              maxWidth: "100%",
              mawHeight: "100%",
            }}
          />
        </Box>
        <Box>
          <Box
            sx={{
              fontSize: isMobile ? "12px" : "16px",
              color: "#232323",
              fontWeight: "500",
              mb: 1,
              wordBreak: "break-all",
            }}
          >
            {product?.name}
          </Box>
          <Box
            sx={{
              color: "#6B7280",
              fontSize: isMobile ? "10px" : "14px",
              fontWeight: "400",
              wordBreak: "break-all",
            }}
          >
            {product?.description}
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: "6px",
              mt: 1,
              flexWrap: "wrap",
            }}
          >
            {product?.combined_tags?.map((tag) => (
              <Box
                sx={{
                  padding: "0px 4px",
                  borderRadius: "4px",
                  background: tag?.color,
                  color: "white",
                  fontWeight: "500",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
                // onClick={() => {
                //     router.push(
                //       `/products/?tagId=${tag?.id}&tagName=${
                //         tag?.name_ar
                //       }&tagNameEn=${tag?.name_en}&tagColor=${encodeURIComponent(
                //         tag?.color
                //       )}`
                //     );
                // }}
              >
                {tag?.name}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          minWidth: "fit-content",
          justifyContent: "flex-end",
        }}
      >
        {!!product?.price_before_discount && (
          <Box
            component="span"
            sx={{
              textDecoration: "line-through",
              color: "#B0B0B0",
              fontSize: isMobile ? "10px" : "16px",
              fontWeight: "500",
              mx: 1,
            }}
          >
            {product?.price_before_discount?.toFixed(2)}
          </Box>
        )}
        <Box
          component="span"
          sx={{
            color: "#EB3C24",
            fontSize: isMobile ? "15px" : "24px",
            fontWeight: "500",
          }}
        >
          {product?.price?.toFixed(2) || 0} {riyalImgRed()}
        </Box>
      </Box>
    </Box>
  );
}

export default ServiceDataInfo;
