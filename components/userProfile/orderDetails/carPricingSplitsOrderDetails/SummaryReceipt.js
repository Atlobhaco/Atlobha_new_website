import AccordionWalletBalance from "@/components/shared/AccordionWalletBalance";
import SharedBtn from "@/components/shared/SharedBtn";
import useLocalization from "@/config/hooks/useLocalization";
import { STATUS } from "@/constants/enums";
import { riyalImgBlack, riyalImgRed } from "@/constants/helpers";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import React from "react";

function SummaryReceipt({ orderDetails, selectedOffer, setSteps = () => {} }) {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();

  const text = {
    color: "#232323",
    fontSize: isMobile ? "12px" : "15px",
    fontWeight: "500",
  };
  const header = {
    color: "#232323",
    fontSize: isMobile ? "16px" : "22px",
    fontWeight: "700",
    mb: 1,
  };
  const vat = {
    color: "#6B7280",
    fontSize: isMobile ? "11px" : "13px",
    fontWeight: "500",
    mb: 2,
  };
  const boldText = {
    fontSize: isMobile ? "15px" : "19px",
    fontWeight: "700",
    color: "#232323",
  };

  return (
    <Box
      sx={{
        width: isMobile ? "100%" : "50%",
      }}
    >
      <Box sx={header}>{t.orderSummary}</Box>
      {/* service price */}
      <Box className="d-flex justify-content-between mb-2">
        <Box sx={text}>{t.ServicePrice}</Box>
        <Box sx={text}>
          {orderDetails?.receipt?.service_fee}
          {riyalImgBlack()}
        </Box>
      </Box>
      {/* discount */}
      {orderDetails?.receipt?.discount > 0 && (
        <Box className="d-flex justify-content-between mb-2">
          <Box sx={{ ...text, color: "#EB3C24" }}>{t.codeDiscount}</Box>
          <Box sx={{ ...text, color: "#EB3C24" }}>
            {orderDetails?.receipt?.discount} {riyalImgRed()}
          </Box>
        </Box>
      )}
      {/* offer discount */}
      {orderDetails?.receipt?.offers_discount > 0 && (
        <Box className="d-flex justify-content-between mb-2">
          <Box sx={{ ...text, color: "#EB3C24" }}>{t.codeDiscount}</Box>
          <Box sx={{ ...text, color: "#EB3C24" }}>
            {orderDetails?.receipt?.offers_discount} {riyalImgRed()}
          </Box>
        </Box>
      )}

      {/* pay from wallet balance */}
      <AccordionWalletBalance
        title={t.payFromBlanace}
        riyalImg={riyalImgBlack}
        textStyle={text}
        receipt={orderDetails?.receipt}
        receiptRes={{}}
      />

      {/* total pay */}
      <Box className="d-flex justify-content-between mb-2">
        <Box sx={text}>{t.totalSum}</Box>
        <Box sx={text}>
          {orderDetails?.receipt?.total_price} {riyalImgBlack()}
        </Box>
      </Box>

      {/* vat  percentage */}
      <Box sx={vat}>
        {t.include} {orderDetails?.receipt?.tax_percentage * 100}٪{" "}
        {t.vatPercentage} ({orderDetails?.receipt?.subtotal_tax}{" "}
        {riyalImgBlack()})
      </Box>

      {/* rest to pay */}
      {orderDetails?.status === STATUS?.new && (
        <Box className="d-flex justify-content-between mb-2">
          <Box sx={{ ...text, ...boldText }}>{t.remainingtotal}</Box>
          <Box sx={{ ...text, ...boldText }} id="amount-to-pay">
            {orderDetails?.receipt?.amount_to_pay?.toFixed(2)} {riyalImgBlack()}
          </Box>
        </Box>
      )}

      {orderDetails?.status === STATUS?.priced && (
        <SharedBtn
          disabled={!selectedOffer}
          className="big-main-btn"
          customClass="w-100"
          text="confirmOffer"
          onClick={() => setSteps(2)}
        />
      )}
    </Box>
  );
}

export default SummaryReceipt;
