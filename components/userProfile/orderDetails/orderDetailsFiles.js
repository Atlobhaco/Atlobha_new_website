"use client";
import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import style from "../../../pages/spareParts/confirmation/confirmation.module.scss";

export default function OrderDetailsFiles({ fields, divider }) {
  const { isMobile } = useScreenSize();
  const { locale, t } = useLocalization();

  return (
    <>
      {fields?.map((singleField) => {
        const uploadedFile = singleField?.file;

        if (!uploadedFile) return null; // skip if no file uploaded

        return (
          <Box key={singleField?.checkout_field?.id} sx={{ mb: 2 }}>
            {/* === Title === */}
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
                sx={{
                  width: "95%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box className={`${style["deliverySec_address-holder"]}`}>
                  {singleField?.checkout_field?.title}
                </Box>
              </Box>
            </Box>

            {/* === File preview === */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                px: 1,
                justifyContent: "flex-start",
              }}
            >
              {uploadedFile?.mime_type?.startsWith("image/") ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      mb: 1,
                      borderRadius: "10px",
                    }}
                  >
                    <img
                      src={uploadedFile.url}
                      alt={uploadedFile.name}
                      width={isMobile ? 60 : 90}
                      height={isMobile ? 60 : 70}
                      style={{
                        borderRadius: "8px",
                        objectFit: "cover",
                        marginInlineEnd: "10px",
                        borderRadius: "10px",
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: "#333",
                        mt: 0.5,
                        maxWidth: "150px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontWeight: "700",
                      }}
                    >
                      {uploadedFile.name}
                    </Typography>
                  </Box>
                  <Divider
                    sx={{ background: "#EAECF0", mb: 1, width: "100%" }}
                  />
                </Box>
              ) : (
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 500,
                    color: "#333",
                  }}
                >
                  📄 {uploadedFile.name}
                </Typography>
              )}
            </Box>
          </Box>
        );
      })}
    </>
  );
}
