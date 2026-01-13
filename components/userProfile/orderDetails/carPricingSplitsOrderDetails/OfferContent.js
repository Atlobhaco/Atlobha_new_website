import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import SharedBtn from "@/components/shared/SharedBtn";
import { riyalImgBlack, riyalImgGrey } from "@/constants/helpers";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import moment from "moment";

function OfferContent({
  offer,
  selectedOffer,
  setSelectedOffer = () => {},
  hideButton = false,
  customBorder = false,
  actionButton = null,
  ExpiredOffer = false,
}) {
  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();

  return (
    <Box
      className="col-md-6 col-12 cursor-pointer"
      mb={2}
      onClick={() => setSelectedOffer(offer)}
    >
      <Box
        sx={{
          padding: isMobile ? "10px" : "10px 24px",
          boxShadow:
            "0 10px 30px -5px rgba(0,0,0,0.10), 0 4px 10px -2px rgba(0,0,0,0.05)",
          border: customBorder
            ? customBorder
            : selectedOffer?.id === offer?.id
            ? "2px solid #F9DD4B"
            : "2px solid #D9D9D9",
          borderRadius: "10px",
          background: "#fff",
        }}
      >
        {/* Image + Title */}
        <Box
          display="flex"
          alignItems="center"
          gap="10px"
          fontSize="14px"
          fontWeight="700"
          mb={2}
        >
          <Image
            src={offer?.store?.cover_image || "/imgs/no-img-holder.svg"}
            alt="company"
            width={40}
            height={40}
            onError={(e) => (e.target.srcset = "/imgs/no-img-holder.svg")} // Fallback to default image
          />
          {locale === "ar" ? offer?.store?.name_ar : offer?.store?.name_en}
        </Box>

        {/* Price Section */}
        <Box
          gap={`${isMobile ? "5px" : "8px"}`}
          borderBottom="1px solid #E5E7EB"
          sx={{ minHeight: "24px" }}
        >
          {offer?.vehicle_price_before_discount && (
            <Box display="flex" alignItems="center" gap="8px">
              <Box
                sx={{
                  background: "#10B981",
                  borderRadius: "4px",
                  padding: "2px 10px",
                  color: "white",
                  fontSize: "11px",
                  fontWeight: "700",
                  width: "fit-content",
                }}
              >
                {t.discount}{" "}
                {(
                  ((offer?.vehicle_price_before_discount -
                    offer?.vehicle_price) /
                    offer?.vehicle_price_before_discount) *
                  100
                ).toFixed(0)}
                %
              </Box>

              <Box
                sx={{
                  textDecoration: "line-through",
                  color: "#9CA3AF",
                  fontSize: isMobile ? "13px" : "16px",
                  fontWeight: "700",
                }}
              >
                {offer?.vehicle_price_before_discount} {riyalImgGrey(12, 16)}
              </Box>
            </Box>
          )}
          <Box fontSize={`${isMobile ? "28px" : "38px"}`} fontWeight="900">
            {offer?.vehicle_price} {riyalImgBlack()}
          </Box>
        </Box>

        {/* Keys / Benefits */}
        {offer?.features?.length ? (
          <Box height="80px" overflow="auto" alignContent="center">
            {offer?.features.map((key, i) => (
              <Box key={i} my="5px">
                <Image
                  src="/imgs/yellow-bg-tick-1.svg"
                  alt="tick"
                  width={18}
                  height={18}
                />
                <Typography
                  component="span"
                  mx={1}
                  color="#404040"
                  fontSize="14px"
                  fontWeight="700"
                >
                  {key}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Box textAlign="center" p={2} alignContent="center">
            <Box color="#1C1C28" fontSize="20px" fontWeight="500">
              {t.noExtraBenefits}
            </Box>
            <Box color="#0F172A" fontSize="13px" fontWeight="400">
              {t.toThisOffer}
            </Box>
          </Box>
        )}

        {/* validation date */}
        <Box
          my="5px"
          borderBottom={`${
            hideButton && !actionButton ? "none" : "1px solid #E5E7EB"
          }`}
        >
          <Image
            src="/imgs/validity.svg"
            alt="validity"
            width={24}
            height={24}
          />
          <Typography
            component="span"
            mx={1}
            color="#6A7282"
            fontSize="14px"
            fontWeight="700"
          >
            {!ExpiredOffer
              ? `${t.validTo} ${moment(offer?.expire_at).format("D MMMM YYYY")}`
              : t.expired}
          </Typography>
        </Box>

        {/* confirmation button */}
        {!hideButton && (
          <SharedBtn
            text="chooseThisOffer"
            onClick={() => {
              setSelectedOffer(offer);
            }}
            className={`${
              selectedOffer?.id === offer?.id ? "big-main-btn" : "black-btn"
            }`}
            customClass={`w-100 ${
              selectedOffer?.id === offer?.id ? "" : "text-warning"
            }`}
          />
        )}
        {/* custom  button */}
        {actionButton}
      </Box>
    </Box>
  );
}

export default OfferContent;
