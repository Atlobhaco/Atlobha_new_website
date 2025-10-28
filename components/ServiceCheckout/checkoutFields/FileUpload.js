"use client";
import React, { useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import Image from "next/image";
import style from "../../../pages/spareParts/confirmation/confirmation.module.scss";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { toast } from "react-toastify";

export default function FileUpload({
  field,
  selectedFields,
  setSelectedFields,
}) {
  const { isMobile } = useScreenSize();
  const { locale, t } = useLocalization();
  const [uploadingIds, setUploadingIds] = useState([]); // Track uploading fields
  const [debug, setDebug] = useState(true); // enable/disable overlay
  const [debugInfo, setDebugInfo] = useState([]);

  const logDebug = (message, data = null) => {
    const entry = {
      time: new Date().toLocaleTimeString(),
      message,
      data,
    };
    setDebugInfo((prev) => [...prev.slice(-20), entry]); // keep last 20 logs
    console.log("[DEBUG]", message, data); // still log to console
  };

  // Allowed types
  const allowedImageTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/svg+xml",
  ];
  const allowedDocTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  // 🔹 Handle upload logic
  const handleFileUpload = async (file, singleField) => {
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isAllowed =
      (isImage && allowedImageTypes.includes(file.type)) ||
      (!isImage && allowedDocTypes.includes(file.type));

    if (!isAllowed) {
      toast.error(t.fileNotSupported);
      return;
    }

    const endpoint = isImage ? "/files/image" : "/files/document";
    const formData = new FormData();
    formData.append("file", file);
    const keyName = singleField?.checkout_field?.type;
    const checkoutFieldId = singleField?.checkout_field?.id;

    const tempUrl = URL.createObjectURL(file);

    // 🔹 Mark field as uploading
    setUploadingIds((prev) => [...prev, checkoutFieldId]);
    logDebug("File selected", { fileName: file?.name, type: file?.type });
    logDebug("Uploading to", endpoint);
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
      logDebug("Response status", res.status);

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      logDebug("Upload success", data);

      // 🔹 Save uploaded file
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
              fileUrl: data?.data?.url || data?.url || tempUrl,
              isTemp: false,
              fileId: data?.id,
            },
          ],
        };
      });
    } catch (err) {
      logDebug("Upload error", err.message);
      console.error("Upload error:", err);
      toast.error(t.someThingWrong);
    } finally {
      setUploadingIds((prev) => prev.filter((id) => id !== checkoutFieldId));
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
      {debug && (
        <Box
          sx={{
            position: "fixed",
            bottom: 10,
            right: 10,
            width: "300px",
            maxHeight: "300px",
            overflowY: "auto",
            backgroundColor: "rgba(0,0,0,0.8)",
            color: "#0f0",
            fontSize: "12px",
            padding: "10px",
            borderRadius: "8px",
            zIndex: 9999,
            fontFamily: "monospace",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <strong>Debug Overlay</strong>
            <button
              style={{
                background: "transparent",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => setDebug(false)}
            >
              ✕
            </button>
          </Box>
          {debugInfo.map((log, i) => (
            <Box
              key={i}
              sx={{ borderBottom: "1px solid #333", marginTop: "4px" }}
            >
              <div>
                {log.time} - {log.message}
              </div>
              {log.data && (
                <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                  {JSON.stringify(log.data, null, 2)}
                </pre>
              )}
            </Box>
          ))}
        </Box>
      )}

      {field?.map((singleField, index) => {
        const keyName = singleField?.checkout_field?.type;
        const uploadedFile =
          selectedFields?.[keyName]?.find(
            (f) => f.checkoutFieldId === singleField?.checkout_field?.id
          ) || null;
        const isUploading = uploadingIds.includes(
          singleField?.checkout_field?.id
        );

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
                      mx: isMobile ? 0 : 1,
                    }}
                  >
                    {!singleField?.is_required && t.optional}
                  </Typography>
                </Box>

                {!uploadedFile && (
                  <Box
                    sx={{
                      fontSize: isMobile ? "12px" : "16px",
                      fontWeight: "500",
                      color: "#1FB256",
                      display: "flex",
                      alignItems: "center",
                      gap: isMobile ? "3px" : "6px",
                      cursor: "pointer",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                    onClick={() =>
                      !isUploading && triggerFileSelect(singleField)
                    }
                  >
                    <AddCircleOutlineIcon
                      style={{
                        color: "#1FB256",
                        height: isMobile ? "18px" : "20px",
                        width: isMobile ? "18px" : "20px",
                        marginBottom: "4px",
                      }}
                    />
                    <Box component="span">{t.uploadFile}</Box>
                  </Box>
                )}
              </Box>
            </Box>

            {/* === Uploaded file preview or loader === */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                px: 1,
                justifyContent: "space-between",
              }}
            >
              {isUploading ? (
                <CircularProgress
                  size={20}
                  sx={{
                    color: "#FFD400",
                    mx: 5,
                  }}
                />
              ) : (
                uploadedFile && (
                  <>
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
                  </>
                )
              )}
            </Box>
          </Box>
        );
      })}
    </>
  );
}
