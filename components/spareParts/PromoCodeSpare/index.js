import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Image from "next/image";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPromoCodeForSpareParts } from "@/redux/reducers/addSparePartsReducer";
import useLocalization from "@/config/hooks/useLocalization";

function PromoCodeSpare({ confirmed = false }) {
  const dispatch = useDispatch();
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();
  const { promoCode } = useSelector((state) => state.addSpareParts);

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
        <Box
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
        </Box>
      </Box>
      <Box>
        <TextField
          variant="outlined"
          placeholder={t.promoCodePlaceHolder}
          fullWidth
          disabled={confirmed}
          onChange={(e) => {
            dispatch(setPromoCodeForSpareParts({ data: e?.target?.value }));
          }}
          value={promoCode || ""}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ mx: "8px" }}>
                <Image
                  alt="img"
                  src={`/icons/${confirmed ? "green-tick.svg" : "promo.svg"}`}
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
                    color: confirmed ? "#EB3C24" : "black",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (confirmed) {
                      dispatch(setPromoCodeForSpareParts({ data: null }));
                    } else {
                      // happen when add  activate code
                    }
                  }}
                >
                  {confirmed ? t.delete : t.activate}
                </span>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: "44px",
              borderRadius: "8px",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: confirmed && "#1FB256", // Set hover border color
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
              border: confirmed && "1px solid #1FB256",
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
