import useLocalization from "@/config/hooks/useLocalization";
import { Box } from "@mui/material";
import React from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import moment from "moment";
import IconButton from "@mui/material/IconButton";
import Image from "next/image";
import { useRouter } from "next/router";
import { ORDERSENUM, STATUS } from "@/constants/enums";

function OrderNumCopyWhatsapp({ orderDetails = {}, handleCopy = () => {} }) {
  const { t } = useLocalization();
  const router = useRouter();
  const { type } = router.query;

  const ShowInvoice = () => {
    if (
      type === ORDERSENUM?.marketplace ||
      (type === ORDERSENUM?.spareParts &&
        (orderDetails?.status === STATUS?.priced ||
          orderDetails?.status === STATUS?.confirmed))
    ) {
      return (
        <Box>
          <IconButton
            color="inherit"
            onClick={() => {
              window.open(orderDetails?.invoice_url, "noopener,noreferrer");
            }}
          >
            <Image
              src="/icons/print.svg"
              width={20}
              height={20}
              alt="print-invoice"
            />
          </IconButton>
        </Box>
      );
    }
  };

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
      {ShowInvoice()}
    </Box>
  );
}

export default OrderNumCopyWhatsapp;
