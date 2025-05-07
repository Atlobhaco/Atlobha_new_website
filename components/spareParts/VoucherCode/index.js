import { VOUCHERS } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { setVoucher } from "@/redux/reducers/addSparePartsReducer";
import { Box, InputAdornment, TextField } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

function VoucherCode({
  customTitle = false,
  setCanAddVoucher = () => {},
  canAddVoucher = false,
  setInputValVoucher = () => {},
  inputValVoucher = false,
}) {
  const [error, setError] = useState(false);
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();
  const dispatch = useDispatch();
  const { voucherCode } = useSelector((state) => state.addSpareParts);

  const { refetch: checkVoucher } = useCustomQuery({
    name: "checkVoucher",
    url: `${VOUCHERS}?voucher_code=${inputValVoucher}`,
    refetchOnWindowFocus: false,
    enabled: false,
    retry: 0,
    method: "post",
    select: (res) => res?.data?.data,
    onSuccess: (res) => {
      if (res?.amount) {
        setError(false);
        setCanAddVoucher(res);
        dispatch(setVoucher({ data: res }));
      } else {
        toast.error(t.voucherNotFound);
      }
    },
    onError: (err) => {
      if (err?.status) {
        setError(true);
        toast.error(t.voucherNotFound);
      }
    },
  });

  return (
    <Box
      sx={{
        borderBottom: isMobile ? "3px solid #F8F8F8" : "unset",
        paddingBottom: isMobile ? "15px" : "unset",
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
            color: customTitle ? "#1C1C28" : "inherit",
          }}
        >
          {customTitle || t.voucher}
        </Box>
      </Box>
      <Box>
        <TextField
          variant="outlined"
          placeholder={t.addGiftVoucher}
          fullWidth
          disabled={canAddVoucher ? true : false}
          onChange={(e) => {
            setError(false);
            setInputValVoucher(e?.target?.value);
          }}
          value={inputValVoucher || ""}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ mx: "8px" }}>
                <Image
                  alt="img-voucher"
                  src={`/icons/${
                    canAddVoucher ? "green-tick.svg" : "promo.svg"
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
                      canAddVoucher || error
                        ? "#EB3C24"
                        : inputValVoucher?.length >= 3
                        ? "black"
                        : "grey",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (error) {
                      setError(false);
                      setInputValVoucher(false);
                      //   dispatch(setVoucher({ data: null }));
                      //   setCanAddVoucher(false);
                    } else {
                      if (inputValVoucher?.length >= 3) {
                        checkVoucher();
                      }
                    }
                  }}
                >
                  {voucherCode ? "" : error ? t.delete : t.activate}
                </span>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: "44px",
              borderRadius: "8px",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: error ? "red" : canAddVoucher ? "#1FB256" : "", // Set hover border color
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
                : canAddVoucher
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

export default VoucherCode;
