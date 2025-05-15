import useLocalization from "@/config/hooks/useLocalization";
import {
  riyalImgBlack,
  riyalImgOrange,
  riyalImgRed,
} from "@/constants/helpers";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, Divider, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

function TitlePrice({ prod }) {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();

  return (
    <>
      <Box
        sx={{
          color: "#1C1C28",
          fontWeight: "700",
          fontSize: "20px",
        }}
      >
        {prod?.name}
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: "6px",
          mt: 1,
          flexWrap: "wrap",
        }}
      >
        {prod?.combined_tags?.map((tag) => (
          <Box
            sx={{
              padding: "0px 4px",
              borderRadius: "4px",
              background: tag?.color,
              color: "white",
              fontWeight: "500",
              fontSize: "14px",
            }}
          >
            {tag?.name}
          </Box>
        ))}
      </Box>

      <Divider
        sx={{
          background: "#EAECF0",
          my: 1,
          height: "5px",
          borderBottomWidth: "0px",
        }}
      />

      <Box sx={{ display: "flex", alignItems: "start", gap: "10px", mt: 2 }}>
        <Box>
          <Box
            sx={{
              color: "#EB3C24",
              fontWeight: "500",
              fontSize: isMobile ? "19px" : "24px",
            }}
          >
            {prod?.price?.toFixed(2)} {riyalImgRed()}
          </Box>
          {!!prod?.price_before_discount && (
            <Box
              sx={{
                display: "flex",
                gap: "5px",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  textDecoration: "line-through",
                  fontSize: "16px",
                  color: "grey",
                  letterSpacing: "1.4px",
                }}
              >
                {prod?.price_before_discount?.toFixed(2)}
              </Box>
              <Box
                component="span"
                sx={{
                  textDecoration: "unset",
                  color: "#EB3C24",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                {Math.round(
                  ((prod?.price_before_discount?.toFixed(2) -
                    prod?.price?.toFixed(2)) /
                    prod?.price_before_discount?.toFixed(2)) *
                    100
                )}
                % خصم
              </Box>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            color: "#374151",
            fontSize: "15px",
            fontWeight: "400",
          }}
        >
          {t.PriceIncludeVat}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          width: isMobile ? "100%" : "60%",
          mt: 1,
        }}
      >
        <Box
          sx={{
            color: "#232323",
          }}
        >
          {t.pay}{" "}
          <Box
            component="span"
            sx={{
              fontWeight: "500",
            }}
          >
            {(prod?.price?.toFixed(2) / 5)?.toFixed(2)} {riyalImgBlack()}
          </Box>{" "}
          {t.otherInstallment}
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: "5px",
          }}
        >
          <Image
            src="/imgs/tamara.svg"
            width={52}
            height={22}
            alt="tamara"
            style={{
              height: "auto",
              width: "65px",
            }}
          />
          <Image
            src="/imgs/tabby-prod.svg"
            width={52}
            height={18}
            alt="tabby"
            style={{
              height: "auto",
              width: "50px",
            }}
          />
        </Box>
      </Box>
    </>
  );
}

export default TitlePrice;
