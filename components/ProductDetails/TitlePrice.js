import useLocalization from "@/config/hooks/useLocalization";
import { riyalImgBlack, riyalImgRed } from "@/constants/helpers";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, Divider, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import { toast } from "react-toastify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useRouter } from "next/router";

function TitlePrice({ prod }) {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const router = useRouter();

  const handleCopy = (refNum) => {
    navigator.clipboard.writeText(refNum).then(
      () => {
        toast.success(`${t.copySuccess}, ${refNum}`);
      },
      (err) => {}
    );
  };

  return (
    <>
      <Box
        sx={{
          color: "#1C1C28",
          fontWeight: "700",
          fontSize: "20px",
          display: isMobile ? "block" : "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1px",
        }}
      >
        <Box>{prod?.name}</Box>
        <Box
          onClick={() => handleCopy(prod?.ref_num)}
          sx={{
            background: "#818181",
            padding: isMobile ? "2px 4px" : "3px 5px",
            borderRadius: "10px",
            color: "white",
            fontSize: isMobile ? "12px" : "18px",
            width: "fit-content",
            cursor: "pointer",
          }}
        >
          <ContentCopyIcon
            sx={{
              width: isMobile ? "14px" : "19px",
              color: "white",
              ml: isMobile ? 0 : 1,
            }}
            onClick={() => handleCopy(prod?.ref_num)} // Add onClick handler
          />
          {prod?.ref_num}
        </Box>
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
              cursor: "pointer",
            }}
            onClick={() => {
              router.push(`/products/?tagId=${tag?.id}`);
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

      <Box
        sx={{
          display: "flex",
          alignItems: "start",
          gap: isMobile ? "3px" : "10px",
          mt: 2,
        }}
      >
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
                  fontSize: isMobile ? "16px" : "16px",
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
                  fontSize: isMobile ? "12px" : "12px",
                  fontWeight: "500",
                }}
              >
                {Math.round(
                  ((prod?.price_before_discount?.toFixed(2) -
                    prod?.price?.toFixed(2)) /
                    prod?.price_before_discount?.toFixed(2)) *
                    100
                )}
                % {t.discount}
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
            {(prod?.price?.toFixed(2) / 4)?.toFixed(2)} {riyalImgBlack()}
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
            loading="lazy"
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
            loading="lazy"
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
