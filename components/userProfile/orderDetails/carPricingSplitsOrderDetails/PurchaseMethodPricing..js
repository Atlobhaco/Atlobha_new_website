import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

function PurchaseMethodPricing({ style, orderDetails, cololredBoxStyle }) {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();

  const isCash = orderDetails?.store_payment_method === "CASH";

  const installmentsInfo = [
    { key: t.duration, value: "-", valueColor: "#232323" },
    {
      key: t.depositeValue,
      value: `${orderDetails?.down_payment} ${t.sar}`,
      valueColor: "#232323",
    },
    {
      key: t.installmentMethod,
      value: t.bankInstalment,
      valueColor: "#22C55E",
    },
    {
      key: t.workAs,
      value: orderDetails?.job_title,
      valueColor: "#232323",
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-3">
        <Image src="/icons/yellow-card.svg" alt="car" width={20} height={20} />
        <div className={style.heading}>{t.purchaseMethod}</div>
      </div>

      {/* Main Box */}
      <Box sx={cololredBoxStyle}>
        <Box display="flex" justifyContent="space-between">
          <Box>{t.purchaseMethod}</Box>

          <Box display="flex" alignItems="center" gap="10px">
            {isCash ? t.cash : t.payMethods.INSTALLMENT}
            <Box
              sx={{
                width: 8,
                height: 8,
                background: "#22C55E",
                borderRadius: "50%",
              }}
            />
          </Box>
        </Box>

        {/* Content */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)",
            borderRadius: "10px",
            border: "1px solid #E5E7EB",
            padding: isMobile ? "7px" : "21px 21px 10px 21px",
            display: "flex",
            flexDirection: isCash ? "column" : "row",
            alignItems: "center",
            gap: isCash ? "10px" : "5px",
            mt: 2,
            flexWrap: isCash ? "nowrap" : "wrap",
          }}
        >
          {/* Cash Section */}
          {isCash ? (
            <>
              <Image
                loading="lazy"
                alt="payment-icon"
                src="/icons/tick-bg-green.svg"
                width={48}
                height={48}
              />

              <Typography
                sx={{ color: "#232323", fontWeight: 700, fontSize: "15px" }}
              >
                {t.fullCashPay}
              </Typography>

              <Typography
                sx={{ color: "#4A5565", fontWeight: 400, fontSize: "13px" }}
              >
                {t.PayWhenReceive}
              </Typography>
            </>
          ) : (
            /* Installments Section */
            installmentsInfo.map((info) => (
              <Box
                key={info.key}
                sx={{
                  boxShadow:
                    "0 1px 3px rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10)",
                  background: "white",
                  borderRadius: "8px",
                  padding: isMobile ? "5px" : "10px 12px 10px 12px",
                  width: isMobile ? "49%" : "49%",
                  height: "100px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  fontSize={isMobile ? "11px" : "inherit"}
                  color="#6A7282"
                  fontWeight={500}
                >
                  {info.key}
                </Typography>
                <Typography
                  fontSize={isMobile ? "14px" : "inherit"}
                  color={info.valueColor}
                  fontWeight={700}
                >
                  {info.value}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </>
  );
}

export default PurchaseMethodPricing;
