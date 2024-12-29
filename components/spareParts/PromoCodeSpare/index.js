import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, InputAdornment, TextField } from "@mui/material";
import Image from "next/image";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPromoCodeForSpareParts } from "@/redux/reducers/addSparePartsReducer";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { PROMO_CODES } from "@/config/endPoints/endPoints";
import { toast } from "react-toastify";

function PromoCodeSpare({ promoCodeId, setPromoCodeId }) {
  const dispatch = useDispatch();
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();
  const { promoCode } = useSelector((state) => state.addSpareParts);

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
      } else {
        toast.error(t.promoNotFound);
      }
    },
    onError: (err) => {
      if (err?.status) {
        toast.error(t.promoNotFound);
      }
    },
  });

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
            fontSize: isMobile ? "16px" : "20px",
            fontWeight: "500",
          }}
        >
          {t.promoCode}
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
          disabled={promoCodeId ? true : false}
          onChange={(e) => {
            dispatch(setPromoCodeForSpareParts({ data: e?.target?.value }));
          }}
          value={promoCode || ""}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ mx: "8px" }}>
                <Image
                  alt="img"
                  src={`/icons/${promoCodeId ? "green-tick.svg" : "promo.svg"}`}
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
                    color: promoCodeId
                      ? "#EB3C24"
                      : promoCode?.length >= 3
                      ? "black"
                      : "grey",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (promoCodeId) {
                      setPromoCodeId(false);
                      dispatch(setPromoCodeForSpareParts({ data: null }));
                    } else {
                      if (promoCode?.length >= 3) {
                        checkPromo();
                      }
                    }
                  }}
                >
                  {promoCodeId ? t.delete : t.activate}
                </span>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: "44px",
              borderRadius: "8px",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: promoCodeId ? "#1FB256" : "", // Set hover border color
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "black", // Change border color to red when focused
              },
              "&.Mui-disabled": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1FB256", // Keep border green when disabled
                },
              },
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderRadius: "8px",
              border: promoCodeId ? "1px solid #1FB256" : "",
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
