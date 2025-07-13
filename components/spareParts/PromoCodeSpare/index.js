import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, InputAdornment, TextField } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPromoCodeAllData,
  setPromoCodeForSpareParts,
} from "@/redux/reducers/addSparePartsReducer";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { PROMO_CODES } from "@/config/endPoints/endPoints";
import { toast } from "react-toastify";

function PromoCodeSpare({ promoCodeId, setPromoCodeId, customTitle = false }) {
  const dispatch = useDispatch();
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();
  const { promoCode, allPromoCodeData } = useSelector(
    (state) => state.addSpareParts
  );
  const [error, setError] = useState(false);

  const { refetch: checkPromo } = useCustomQuery({
    name: "checkPromoCode",
    url: `${PROMO_CODES}/${promoCode}`,
    refetchOnWindowFocus: false,
    enabled: false,
    retry: 0,
    select: (res) => res?.data?.data,
    onSuccess: (res) => {
      if (res?.can_be_redeemed) {
        setPromoCodeId(res?.id);
        setError(false);
        dispatch(setPromoCodeAllData({ data: res }));
      } else {
        toast.error(t.promoNotFound);
      }
    },
    onError: (err) => {
      if (err?.status) {
        setError(true);
        toast.error(t.promoNotFound);
      }
    },
  });

  const returnValueInsideInput = () => {
    if (allPromoCodeData?.id) {
      if (allPromoCodeData?.type === "FIXED") {
        return `${allPromoCodeData?.code} (${allPromoCodeData?.value} ${t.sar})`;
      } else {
        return `${allPromoCodeData?.code} (${allPromoCodeData?.value}%) `;
      }
    } else {
      return promoCode || "";
    }
  };

  return (
    <Box
      sx={{
        borderBottom: isMobile ? "3px solid #F8F8F8" : "unset",
        paddingBottom: isMobile ? "15px" : "unset",
        // borderRadius: isMobile ? "20px" : "unset",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Box
          sx={{
            fontSize: isMobile ? "15px" : "20px",
            fontWeight: "500",
            color: customTitle ? "#1C1C28" : "inherit",
          }}
        >
          {customTitle || t.promoCode}
        </Box>
        {/* <Box
          sx={{
            fontSize: isMobile ? "10px" : "12px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          <Box component="span">{t.showAll}</Box>
          <Image
            alt="img"
            src="/icons/arrow-left.svg"
            width={16}
            height={16}
            style={{
              transform: `rotate(${locale === "ar" ? "0deg" : "180deg"})`,
              marginInlineStart: "5px",
            }}
          />
        </Box> */}
      </Box>
      <Box>
        <TextField
          variant="outlined"
          placeholder={t.promoCodePlaceHolder}
          fullWidth
          disabled={promoCodeId || allPromoCodeData ? true : false}
          onChange={(e) => {
            setError(false);
            dispatch(setPromoCodeForSpareParts({ data: e?.target?.value }));
          }}
          value={returnValueInsideInput()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ mx: "8px" }}>
                <Image
                  loading="lazy"
                  alt="img"
                  src={`/icons/${
                    promoCodeId || allPromoCodeData
                      ? "green-tick.svg"
                      : "promo.svg"
                  }`}
                  width={24}
                  height={24}
                />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "500",
                    color:
                      promoCodeId || allPromoCodeData || error
                        ? "#EB3C24"
                        : promoCode?.length >= 1
                        ? "black"
                        : "grey",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (promoCodeId || allPromoCodeData || error) {
                      setError(false);
                      setPromoCodeId(false);
                      dispatch(setPromoCodeForSpareParts({ data: null }));
                      dispatch(setPromoCodeAllData({ data: null }));
                    } else {
                      if (promoCode?.length >= 1) {
                        checkPromo();
                      }
                    }
                  }}
                >
                  {promoCodeId || allPromoCodeData || error
                    ? t.delete
                    : t.activate}
                </span>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: "44px",
              borderRadius: "8px",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: error
                  ? "red"
                  : promoCodeId || allPromoCodeData
                  ? "#1FB256"
                  : "", // Set hover border color
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "black", // Change border color to black when focused
              },
              "&.Mui-disabled": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: error ? "red" : "#1FB256", // Keep border green when disabled
                },
              },
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderRadius: "8px",
              border: error
                ? "1px solid red"
                : promoCodeId || allPromoCodeData
                ? "1px solid #1FB256"
                : "",
            },
            "& .MuiInputBase-input": {
              color: "black", // Ensure text color is black
              WebkitTextFillColor: "black !important", // Override browser-specific styles
              opacity: 1, // Prevent default disabled opacity
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default PromoCodeSpare;
