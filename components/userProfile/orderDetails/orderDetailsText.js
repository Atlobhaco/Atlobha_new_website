import React from "react";
import { Box, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import style from "../../../pages/spareParts/confirmation/confirmation.module.scss";

function OrderDetailsText({ fields }) {
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();

  return (
    <>
      {fields?.map((singleField) => {
        const checkoutField = singleField?.checkout_field;
        const title = checkoutField?.title;
        const text = singleField?.text;

        // Skip if no text
        if (!text) return null;

        return (
          <Box key={checkoutField?.id} className="mb-3">
            {/* Title Section */}
            <Box
              className={`${style["deliverySec"]} gap-0 align-items-center mb-1 border-bottom-0 py-1`}
            >
              <InfoOutlinedIcon
                sx={{
                  width: "25px",
                  height: "25px",
                  color: "#FFD400",
                  ...(locale === "ar" ? { ml: 1 } : { mr: 1 }),
                }}
              />
              <Box
                sx={{ width: "95%" }}
                className={`${style["deliverySec_address"]}`}
              >
                <Box className={`${style["deliverySec_address-holder"]}`}>
                  {title}
                </Box>
              </Box>
            </Box>

            {/* Text Content */}
            <Box
              sx={{
                mx: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: "15px",
                  color: "#333",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {text}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </>
  );
}

export default OrderDetailsText;
