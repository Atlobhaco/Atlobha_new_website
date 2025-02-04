import useLocalization from "@/config/hooks/useLocalization";
import { Box, Typography } from "@mui/material";
import React from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import OrderStatus from "../ordersList/orderStatus/orderStatus";
import { useRouter } from "next/router";
import { ORDERSENUM } from "@/constants/helpers";

function TrackOrder({ orderDetails = {}, handleCopy = () => {} }) {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const router = useRouter();
  const { type } = router.query;

  const parentStyle = {
    minWidth: "25%",
    height: "100%",
    padding: "4px 0px 4px 4px",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "10px",
    display: "inline-flex",
  };
  const lineStyle = {
    alignSelf: "stretch",
    height: 5,
    background: "#EE772F",
    borderRadius: 11,
  };
  const textStyle = {
    textAlign: "center",
    color: "#374151",
    fontSize: 12,
    fontWeight: "700",
    // wordWrap: "break-word",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: `calc(75vw / 4)`,
  };

  const renderColorDependOnStatusProgress = (currentStep, index) => {
    if (!orderDetails?.changes?.length) {
      // If changes array is empty, return orange for the first step, grey for others
      return index === 0 ? "#EE772F" : "#A1AEBE";
    }

    const stepIndex = orderDetails.changes.findIndex(
      (obj) => obj.status === currentStep
    );

    if (stepIndex === -1) {
      return "#A1AEBE"; // Grey color
    }

    if (
      stepIndex === orderDetails.changes.length - 1 &&
      currentStep !== "delivered"
    ) {
      return "#EE772F"; // Orange color
    }

    return "#1FB256"; // Green color
  };

  return (
    <Box
      sx={{
        padding: isMobile ? "10px 17px" : "16px 24px",
        background: "#F6F6F6",
      }}
    >
      <Box>
        {ORDERSENUM?.spareParts === type && (
          <Box sx={parentStyle}>
            <Box
              sx={{
                ...lineStyle,
                background: renderColorDependOnStatusProgress("priced", 0),
              }}
            />
            <Box sx={textStyle}>{t.inPricing}</Box>
          </Box>
        )}
        <Box sx={parentStyle}>
          <Box
            sx={{
              ...lineStyle,
              background: renderColorDependOnStatusProgress("confirmed", 1),
            }}
          />
          <Box sx={textStyle}>{t.inCorfirmed}</Box>
        </Box>
        {ORDERSENUM?.marketplace === type && (
          <Box sx={parentStyle}>
            <Box
              sx={{
                ...lineStyle,
                background: renderColorDependOnStatusProgress(
                  "ready-to-ship",
                  2
                ),
              }}
            />
            <Box sx={textStyle}>{t.inPrepare}</Box>
          </Box>
        )}
        <Box sx={parentStyle}>
          <Box
            sx={{
              ...lineStyle,
              background: renderColorDependOnStatusProgress("shipping", 3),
            }}
          />
          <Box sx={textStyle}>{t.inShipping}</Box>
        </Box>
        <Box sx={parentStyle}>
          <Box
            sx={{
              ...lineStyle,
              background: renderColorDependOnStatusProgress("delivered", 4),
            }}
          />
          <Box sx={textStyle}>{t.inDelivery}</Box>
        </Box>
      </Box>

      <Box
        sx={{
          mt: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography component="span">{t.trackOrder}</Typography>{" "}
          <Typography
            sx={{
              color: "#6B7280",
              fontSize: "14px",
            }}
            component="span"
          >
            #{orderDetails?.id}
            <ContentCopyIcon
              sx={{
                cursor: "pointer",
                width: isMobile ? "17px" : "20px",
                color: "grey",
              }}
              onClick={() => handleCopy(orderDetails?.id)} // Add onClick handler
            />
          </Typography>{" "}
        </Box>
        <OrderStatus status={orderDetails?.status} />
      </Box>
    </Box>
  );
}

export default TrackOrder;
