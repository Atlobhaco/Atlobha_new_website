import React from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Typography } from "@mui/material";
import style from "../../../pages/spareParts/confirmation/confirmation.module.scss";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import Image from "next/image";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

function FileUpload({ field, selectedFields, setSelectedFields }) {
  const { isMobile } = useScreenSize();
  const { locale, t } = useLocalization();

  const navbar =
    typeof window !== "undefined" && document.getElementById("navbar");
  const bgColor = navbar
    ? window.getComputedStyle(navbar).backgroundColor
    : "#E7F5FF";

  // Store selection per field by its type or ID
  const handleSelect = ({ checkoutFieldId, keyName, option }) => {
    setSelectedFields((prev) => {
      const prevSelections = prev[keyName] || [];

      // Check if this option is already selected for this checkoutFieldId
      const alreadySelected = prevSelections.some(
        (sel) => sel.checkoutFieldId === checkoutFieldId && sel.id === option.id
      );

      if (alreadySelected) {
        // Remove it (toggle off)
        return {
          ...prev,
          [keyName]: prevSelections.filter(
            (sel) =>
              !(sel.checkoutFieldId === checkoutFieldId && sel.id === option.id)
          ),
        };
      }

      // Otherwise: remove old selection for this field, then add new one
      const otherSelections = prevSelections.filter(
        (sel) => sel.checkoutFieldId !== checkoutFieldId
      );

      return {
        ...prev,
        [keyName]: [...otherSelections, { checkoutFieldId, ...option }],
      };
    });
  };

  return (
    <>
      {field?.map((singleField) => {
        return (
          <Box key={singleField?.id}>
            <Box
              className={`${style["deliverySec"]} gap-0 align-items-center mb-1 border-bottom-0`}
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
                sx={{
                  width: "95%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box className={`${style["deliverySec_address-holder"]}`}>
                  {singleField?.checkout_field?.title}{" "}
                  <Typography
                    component="span"
                    sx={{
                      color: "#B0B0B0",
                      mx: 1,
                    }}
                  >
                    {!singleField?.is_required && t.optional}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    fontSize: isMobile ? "12px" : "16px",
                    fontWeight: "500",
                    color: "#1FB256",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  <AddCircleOutlineIcon
                    style={{
                      color: "#1FB256",
                      height: "20px",
                      width: "20px",
                      marginBottom: "4px",
                    }}
                  />
                  <Box
                    onClick={() => {
                      // logic for upload file i  want to call the endpoint that is called media
                    }}
                    component="span"
                  >
                    {t.uploadFile}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        );
      })}
    </>
  );
}

export default FileUpload;
