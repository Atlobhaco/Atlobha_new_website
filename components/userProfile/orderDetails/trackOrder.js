import useLocalization from "@/config/hooks/useLocalization";
import { Box, Typography } from "@mui/material";
import React from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import OrderStatus from "../ordersList/orderStatus/orderStatus";
import { useRouter } from "next/router";
import { statusArray } from "@/constants/helpers";
import { ORDERSENUM, STATUS } from "@/constants/enums";

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
    const { status } = orderDetails || {};
    const isMarketplaceType =
      type === ORDERSENUM?.marketplace ||
      type === ORDERSENUM?.maintenance ||
      type === ORDERSENUM?.PORTABLE;

    // for spare parts in pricing  (0 index)
    if (status === STATUS?.new && type === ORDERSENUM?.spareParts) {
      return index === 0 ? "#EE772F" : "#A1AEBE";
    }

    // for marketplace confirmed (first index)
    if (
      (status === STATUS?.new || status === STATUS?.processing) &&
      isMarketplaceType
    ) {
      return index === 1 ? "#EE772F" : "#A1AEBE";
    }

    if (status === STATUS?.priced) {
      return index === 0 ? "#1FB256" : index === 1 ? "#EE772F" : "#A1AEBE";
    }

    if (status === STATUS?.confirmed) {
      return index === 0 || index === 1 || (index === 2 && isMarketplaceType)
        ? "#1FB256"
        : isMarketplaceType && (index === 2 || index === 3)
        ? "#EE772F"
        : "#A1AEBE";
    }

    // need to remove readyToShip it is wrong
    if (status === STATUS?.shipping) {
      return index === 0 ||
        index === 1 ||
        index === 3 ||
        (isMarketplaceType && (index === 2 || index === 3)) ||
        (type === ORDERSENUM?.spareParts && index === 3)
        ? "#1FB256"
        : index === 4
        ? "#EE772F"
        : "#A1AEBE";
    }

    if (status === STATUS?.delivered) return "#1FB256";
    if (status === STATUS?.completed) return "#1FB256"; //green
    if (status === STATUS?.returned) return "#A1AEBE"; //grey
    if (
      status === STATUS?.cancelled ||
      status === STATUS?.priceUnavailable ||
      status === STATUS?.incomplete
    ) {
      return index === 0 ? "#1FB256" : "#EB3C24";
    }

    // "#EB3C24" red color
    // "#1FB256" green color
    // "#A1AEBE" grey color
    // "#EE772F" orange color
  };

  return (
    <Box
      sx={{
        padding: isMobile ? "10px 17px" : "16px 24px",
        background: "#F6F6F6",
      }}
    >
      {orderDetails?.status === STATUS?.cancelled ||
      orderDetails?.status === STATUS?.priceUnavailable ||
      orderDetails?.status === STATUS?.incomplete ||
      orderDetails?.status === STATUS?.returned ? (
        <>
          <Box sx={{ ...parentStyle, width: "50%" }}>
            <Box
              sx={{
                ...lineStyle,
                background: renderColorDependOnStatusProgress("priced", 0),
              }}
            />
            <Box sx={textStyle}>
              {orderDetails?.status === STATUS?.incomplete
                ? t.inPricing
                : t.new}
            </Box>
          </Box>

          <Box sx={{ ...parentStyle, width: "50%" }}>
            <Box
              sx={{
                ...lineStyle,
                background: renderColorDependOnStatusProgress("confirmed", 1),
              }}
            />
            <Box sx={textStyle}>
              {statusArray()?.find((d) => d?.id === orderDetails?.status)?.name}
            </Box>
          </Box>
        </>
      ) : (
        <>
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
            {/* need to handle this type for marketplace and render the color */}
            {(ORDERSENUM?.marketplace === type ||
              ORDERSENUM?.PORTABLE === type ||
              ORDERSENUM?.maintenance === type) && (
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
        </>
      )}
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
            #{orderDetails?.reference_code}{" "}
            <ContentCopyIcon
              sx={{
                cursor: "pointer",
                width: isMobile ? "17px" : "20px",
                color: "grey",
              }}
              onClick={() => handleCopy(orderDetails?.reference_code)} // Add onClick handler
            />
          </Typography>{" "}
        </Box>
        <OrderStatus status={orderDetails?.status} />
      </Box>
    </Box>
  );
}

export default TrackOrder;
