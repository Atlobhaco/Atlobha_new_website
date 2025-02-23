import useLocalization from "@/config/hooks/useLocalization";
import { Box } from "@mui/material";
import React from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import moment from "moment";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import IconButton from "@mui/material/IconButton";

function OrderNumCopyWhatsapp({ orderDetails = {}, handleCopy = () => {} }) {
  const { t } = useLocalization();

  return (
    <Box
      sx={{
        background: "transparent",
        my: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Box
          sx={{
            color: "#0F172A",
            fontSize: "16px",
            fontWeight: 500,
          }}
        >
          {t.orderNum} #{orderDetails?.id}{" "}
          <ContentCopyIcon
            sx={{ cursor: "pointer", width: "17px", color: "grey" }}
            onClick={() => handleCopy(orderDetails?.id)} // Add onClick handler
          />
        </Box>
        <Box sx={{ color: "#6B7280", fontSize: "10px", fontWeight: 500 }}>
          {t.orderedAt} {moment(orderDetails?.created_at).format("D MMM YYYY")}
        </Box>
      </Box>
      <Box>
        <IconButton
          color="inherit"
          onClick={() => {
            window.open(
              `https://api.whatsapp.com/send/?phone=966502670094&text&type=phone_number&app_absent=0`,
              "_blank"
            );
            window.webengage.onReady(() => {
              webengage.track("CUSTOMER_SUPPORT_CLICKED", {
                event_status: true,
              });
            });
          }}
        >
          <WhatsAppIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default OrderNumCopyWhatsapp;
