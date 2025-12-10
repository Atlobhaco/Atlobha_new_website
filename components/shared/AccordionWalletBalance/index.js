import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";

const AccordionWalletBalance = ({
  title, // e.g. t.payFromBlanace
  riyalImg, // function returning the riyal image/icon
  textStyle, // optional sx style object for the text
  receipt, // main receipt object
  receiptRes, // optional override data
}) => {
  const { t } = useLocalization();
  const [expanded, setExpanded] = useState(false);
  const { isMobile } = useScreenSize();

  // ✅ Helper to safely pick value from either object
  const pickValue = (key) =>
    (receiptRes?.[key] ?? receipt?.[key]) === receipt?.[key]
      ? receipt?.[key]
      : receiptRes?.[key];

  const pickValueWithFallback = (primaryKey, fallbackKey) => {
    const primary = pickValue(primaryKey);
    const fallback = pickValue(fallbackKey);
    return primary || fallback || 0;
  };

  // ✅ Hide component if cashback_and_wallet_payment_value is 0, null, or undefinedg
  const walletPaymentValue = pickValue("cashback_and_wallet_payment_value");
  if (!walletPaymentValue || Number(walletPaymentValue) === 0) return null;

  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{
        boxShadow: "none",
        backgroundColor: "transparent",
        margin: 0,
        "&::before": { display: "none" },
        "&.Mui-expanded": {
          margin: 0, // ✅ ensure no margin when expanded
        },
      }}
    >
      <AccordionSummary
        expandIcon={null}
        aria-controls="panel2-content"
        id="panel2-header"
        sx={{
          padding: 0,
          minHeight: "auto",
          "&.Mui-expanded": {
            minHeight: "auto",
          },
          "& .MuiAccordionSummary-content": {
            margin: 0,
            alignItems: "center",
            display: "flex",
          },
          "& .MuiAccordionSummary-content.Mui-expanded ": {
            margin: 0,
          },
        }}
      >
        <Typography
          component="span"
          sx={{ width: "100%", display: "flex", alignItems: "center" }}
          onClick={() => setExpanded(!expanded)}
        >
          {/* ✅ Left text with rotating arrow */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              ...textStyle,
            }}
          >
            {title}
            <ArrowDropDownIcon
              sx={{
                fontSize: "22px",
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }}
            />
          </Box>

          {/* ✅ Right side */}
          <Box
            className="d-flex justify-content-between mb-2"
            sx={{ flexGrow: 1 }}
          >
            <Box sx={textStyle}></Box>
            <Box sx={textStyle}>
              {walletPaymentValue} {riyalImg && riyalImg()}
            </Box>
          </Box>
        </Typography>
      </AccordionSummary>

      {/* ✅ Details Section */}
      <AccordionDetails
        sx={{
          padding: "10px 15px",
          background: "#dfdfdf",
          borderRadius: "8px",
          marginBottom: "10px",
          fontSize: isMobile ? "12px" : "inherit",
        }}
      >
        <Box
          sx={{
            m: 0,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>{t.walletBalance}</Box>
          <Box>
            {pickValueWithFallback(
              "wallet_payment_value",
              "service_fee_wallet_payment_value"
            )}{" "}
            {riyalImg && riyalImg()}
          </Box>
        </Box>

        <Box
          sx={{
            m: 0,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>{t.cashbackBalance}</Box>
          <Box>
            {pickValueWithFallback(
              "cashback_payment_value",
              "service_fee_cashback_payment_value"
            )}{" "}
            {riyalImg && riyalImg()}
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default AccordionWalletBalance;
