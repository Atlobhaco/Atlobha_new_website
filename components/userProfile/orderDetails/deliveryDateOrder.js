import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import React from "react";
import { Image } from "react-bootstrap";

function DeliveryDateOrder({ orderDetails = {} }) {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  return (
    <Box
      sx={{
        padding: "16px 13px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <Box>
        <Image
          src="/icons/yellow-calendar.svg"
          width={20}
          height={20}
          alt="yellow-calendar"
        />
      </Box>
      <Box>
        <Box
          sx={{
            color: "#232323",
            fontSize: isMobile ? "14px" : "20px",
            fontWeight: "700",
            lineHeight: "30px",
            letterSpacing: "-0.4px",
          }}
        >
          {t.deliveryTime}
        </Box>
        <Box
          sx={{
            color: "#1FB256",
            fontSize: isMobile ? "12px" : "16px",
            fontWeight: "500",
            lineHeight: "24px",
          }}
        >
          {orderDetails?.estimated_delivery_date || t.dateLater}
        </Box>
      </Box>
    </Box>
  );
}

export default DeliveryDateOrder;
