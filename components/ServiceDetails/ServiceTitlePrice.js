import useLocalization from "@/config/hooks/useLocalization";
import { riyalImgBlack, riyalImgRed, servicePrice } from "@/constants/helpers";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, Divider } from "@mui/material";
import Image from "next/image";
import React from "react";
import ErrorIcon from "@mui/icons-material/Error";
import { useSelector } from "react-redux";
import { FIXED } from "@/constants/enums";

function ServiceTitlePrice({ prod, tabValue }) {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const { selectedCar, defaultCar } = useSelector((state) => state.selectedCar);

  return (
    <>
      <Box
        sx={{
          color: "#1C1C28",
          fontWeight: "700",
          fontSize: isMobile ? "16px" : "20px",
          display: "flex",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: "4px",
        }}
      >
        <Box>{prod?.name}</Box>
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
              //   router.push(
              //     `/products/?tagId=${tag?.id}&tagName=${
              //       tag?.name_ar
              //     }&tagNameEn=${tag?.name_en}&tagColor=${encodeURIComponent(
              //       tag?.color
              //     )}`
              //   );
            }}
          >
            {tag?.name}
          </Box>
        ))}
      </Box>
      <Box
        className="col-auto"
        sx={{
          mt: 2,
          background: "rgba(196, 225, 253, 0.10)",
          padding: isMobile ? "4px 8px" : "7px 20px",
          borderRadius: "8px",
          display: "flex",
          fontSize: isMobile ? "12px" : "14px",
          fontWeight: "500",
          color: "#429DF8",
          alignItems: "center",
          gap: "8px",
          width: "fit-content",
        }}
      >
        <ErrorIcon
          sx={{
            color: "#429DF8",
            width: isMobile ? 15 : "auto",
          }}
        />
        {tabValue === FIXED ? t.serviceAfterOrder : t.servicePortbaleAfterOrder}
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
            {servicePrice({
              service: prod,
              userCar: selectedCar?.id ? selectedCar : defaultCar,
            })}
            {riyalImgRed()}
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
                    servicePrice({
                      service: prod,
                      userCar: selectedCar?.id ? selectedCar : defaultCar,
                    })) /
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
      {+servicePrice({
        service: prod,
        userCar: selectedCar?.id ? selectedCar : defaultCar,
      }) > 100 && (
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
              {(
                servicePrice({
                  service: prod,
                  userCar: selectedCar?.id ? selectedCar : defaultCar,
                }) / 4
              )?.toFixed(2)}{" "}
              {riyalImgBlack()}
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
      )}
    </>
  );
}

export default ServiceTitlePrice;
