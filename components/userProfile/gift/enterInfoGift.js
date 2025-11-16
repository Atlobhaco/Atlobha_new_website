import ProductCardSkeleton from "@/components/cardSkeleton";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import useLocalization from "@/config/hooks/useLocalization";
import UserForGift from "./userForGift";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

function EnterInfoGift({
  isFetching,
  selectedGift,
  giftCards,
  setSelectedgift,
  DividerSec,
  setSelectedPrice,
  selectedPrice,
  initialValues,
  validationSchema,
  handleSubmit,
  handlePhoneInputChange,
}) {
  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();

  return isFetching ? (
    <div className="row mb-3 mt-3">
      <div className="col-12">
        <ProductCardSkeleton height={isMobile ? 200 : 400} />
      </div>
    </div>
  ) : (
    <div className="row mb-3 mt-3">
      <div className="col-12 d-flex">
        <Image
          src={selectedGift?.url}
          alt="main-gift"
          width={280}
          height={260}
          style={{
            width: isMobile ? "100%" : "60%",
            height: "100%",
            maxHeight: "400px",
            margin: "auto",
          }}
        />
      </div>
      <div className="col-12">
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            overflow: "auto hidden",
            maxWidth: "100%",
            pb: 1,
            mt: isMobile ? 0 : 4,
          }}
        >
          {giftCards?.images?.map((img, index) => (
            <Box
              key={img?.url + index}
              sx={{
                minWidth: isMobile ? "100px" : "130px",
                width: isMobile ? "100px" : "130px",
                height: isMobile ? "80px" : "100px",
                display: "flex",
                border: selectedGift?.id === img?.id && "2px solid #FFD400",
                padding: "5px",
                borderRadius: "10px",
              }}
            >
              <Image
                loading="lazy"
                onClick={() => setSelectedgift(img)}
                width={90}
                height={80}
                alt="prod-img-preview"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "10px",
                  maxWidth: "100%",
                  display: "flex",
                  margin: "auto",
                  maxHeight: isMobile ? "100%" : "80px",
                  cursor: "pointer",
                }}
                src={img?.url || "/imgs/no-prod-img.svg"}
                onError={(e) => (e.target.srcset = "/imgs/no-prod-img.svg")} // Fallback to default image
              />
            </Box>
          ))}
        </Box>
      </div>
      {DividerSec()}
      <div className={`col-12  ${isMobile ? "" : "mt-5"}`}>
        <Box className="d-flex">
          <InfoOutlinedIcon
            sx={{
              width: isMobile ? "18px" : "25px",
              height: isMobile ? "18px" : "25px",
              color: "#FFD400",
              ...(locale === "ar" ? { ml: 1 } : { mr: 1 }),
            }}
          />
          <Typography
            sx={{
              fontWeight: "700",
              color: "#374151",
              fontSize: `${isMobile ? "15px" : "20px"}`,
            }}
          >
            {t.valuesGiftCard}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            overflow: "auto hidden",
            maxWidth: "100%",
            pb: 1,
            mt: 2,
          }}
        >
          {giftCards?.prices
            ?.sort((a, b) => Number(a) - Number(b))
            ?.map((price) => (
              <Box
                key={price}
                sx={{
                  width: isMobile ? "40px" : "50px",
                  height: isMobile ? "30px" : "35px",
                  display: "flex",
                  border: "1px solid #F0F0F0",
                  padding: "5px",
                  borderRadius: "8px",
                  alignItems: "center",
                  justifyContent: "center",
                  color:
                    +selectedPrice?.price === +price ? "#FFFFFF" : "#232323",
                  fontWeight: "500",
                  cursor: "pointer",
                  background: +selectedPrice?.price === +price && "black",
                  fontSize: isMobile ? "12px" : "16px",
                }}
                onClick={() =>
                  setSelectedPrice({
                    price: +price,
                    selectFromDefined: true,
                  })
                }
              >
                {price}
              </Box>
            ))}
        </Box>
        <div
          style={{
            position: "relative",
            display: "inline-block",
          }}
        >
          <input
            inputMode="numeric" // 👈 this makes mobile keyboard show numbers
            pattern="[0-9]*"
            type="text"
            placeholder={t.anotherValue}
            className="custom-input"
            style={{ paddingLeft: "35px" }}
            value={
              !selectedPrice?.selectFromDefined ? selectedPrice?.price : ""
            }
            onChange={(e) => {
              const value = e.target.value;
              // Allow only digits (0–9)
              if (/^\d{0,4}$/.test(value)) {
                setSelectedPrice({
                  price: +value === 0 || !value ? "" : +value,
                  selectFromDefined: false,
                });
              }
            }}
          />
          <AddCircleOutlineIcon
            sx={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              //   color: "#",
              cursor: "pointer",
            }}
          />
        </div>
      </div>
      {DividerSec()}

      <div className={`col-12  ${isMobile ? "" : "mt-5"}`}>
        <UserForGift
          initialValues={initialValues}
          validationSchema={validationSchema}
          handleSubmit={handleSubmit}
          handlePhoneInputChange={handlePhoneInputChange}
          selectedPrice={selectedPrice}
        />
      </div>
    </div>
  );
}

export default EnterInfoGift;
