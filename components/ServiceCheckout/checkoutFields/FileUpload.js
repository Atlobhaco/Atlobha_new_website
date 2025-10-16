"use client";
import React, { useRef } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, Typography, IconButton } from "@mui/material";
import Image from "next/image";
import style from "../../../pages/spareParts/confirmation/confirmation.module.scss";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";

export default function FileUpload({
  field,
  selectedFields,
  setSelectedFields,
}) {
  const { isMobile } = useScreenSize();
  const { locale, t } = useLocalization();

  // 🔹 Handle upload logic
  const handleFileUpload = async (file, singleField) => {
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const endpoint = isImage ? "/files/image" : "/files/document";
    const formData = new FormData();
    formData.append("file", file);

    // 🔸 Create temporary blob URL for instant preview
    const tempUrl = URL.createObjectURL(file);

    // 🔹 Add temporary entry immediately for instant preview
    const keyName = singleField?.checkout_field?.type;
    const checkoutFieldId = singleField?.checkout_field?.id;
    setSelectedFields((prev) => {
      const prevSelections = prev[keyName] || [];
      const otherSelections = prevSelections.filter(
        (sel) => sel.checkoutFieldId !== checkoutFieldId
      );

      return {
        ...prev,
        [keyName]: [
          ...otherSelections,
          {
            checkoutFieldId,
            fileName: file.name,
            fileType: file.type,
            fileUrl: tempUrl, // use blob until real URL returns
            isTemp: true, // mark as temporary
          },
        ],
      };
    });

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage?.getItem("access_token")}`,
            "x-api-key": "w123",
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      // 🔹 Replace temporary entry with backend URL
      setSelectedFields((prev) => {
        const prevSelections = prev[keyName] || [];
        return {
          ...prev,
          [keyName]: prevSelections.map((sel) =>
            sel.checkoutFieldId === checkoutFieldId
              ? {
                  ...sel,
                  fileUrl: data?.data?.url || data?.url || tempUrl,
                  isTemp: false,
                  fileId: data?.id,
                }
              : sel
          ),
        };
      });
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  // 🔹 Trigger file select
  const triggerFileSelect = (singleField) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "*/*";
    input.onchange = (e) => handleFileUpload(e.target.files[0], singleField);
    input.click();
  };

  // 🔹 Remove file
  const handleRemoveFile = (singleField) => {
    const keyName = singleField?.checkout_field?.type;
    const checkoutFieldId = singleField?.checkout_field?.id;

    setSelectedFields((prev) => {
      const updated = { ...prev };
      updated[keyName] = (updated[keyName] || []).filter(
        (sel) => sel.checkoutFieldId !== checkoutFieldId
      );
      return updated;
    });
  };

  return (
    <>
      {field?.map((singleField) => {
        const keyName = singleField?.checkout_field?.type;
        const uploadedFile =
          selectedFields?.[keyName]?.find(
            (f) => f.checkoutFieldId === singleField?.checkout_field?.id
          ) || null;

        return (
          <Box key={singleField?.id}>
            {/* === Field title and upload button === */}
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
                  alignItems: "center",
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
                  onClick={() => triggerFileSelect(singleField)}
                >
                  <AddCircleOutlineIcon
                    style={{
                      color: "#1FB256",
                      height: "20px",
                      width: "20px",
                      marginBottom: "4px",
                    }}
                  />
                  <Box component="span">{t.uploadFile}</Box>
                </Box>
              </Box>
            </Box>

            {/* === Uploaded file preview === */}
            {uploadedFile && (
              <Box
                sx={{
                  //   mt: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  px: 1,
                  justifyContent: "space-between",
                }}
              >
                {uploadedFile.fileType.startsWith("image/") ? (
                  <Box>
                    <img
                      src={uploadedFile.fileUrl}
                      alt={uploadedFile.fileName}
                      width={isMobile ? 50 : 90}
                      height={isMobile ? 50 : 70}
                      style={{
                        borderRadius: "8px",
                        objectFit: "contain",
                        marginInlineEnd: "10px",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "10px",
                      }}
                    >
                      {uploadedFile.fileName}
                    </span>
                  </Box>
                ) : (
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: 500,
                      color: "#333",
                    }}
                  >
                    📄 {uploadedFile.fileName}
                  </Typography>
                )}

                <IconButton
                  color="default"
                  size="small"
                  onClick={() => handleRemoveFile(singleField)}
                >
                  <Image
                    alt="delete"
                    src="/icons/x-close.svg"
                    width={isMobile ? "10" : "20"}
                    height={isMobile ? "10" : "20"}
                  />
                </IconButton>
              </Box>
            )}
          </Box>
        );
      })}
    </>
  );
}
