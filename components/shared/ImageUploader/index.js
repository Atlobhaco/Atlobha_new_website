import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Box, Typography } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Image from "next/image";

const imgHolderStyle = {
  border: "2px dashed #ccc",
  borderRadius: "8px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
  width: "100%",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f9f9f9",
  height: "150px",
  "&:hover": {
    backgroundColor: "#f0f0f0",
  },
};

const ImageUploader = ({
  formik = false,
  uploadedImage = "",
  handleImageUpload = () => {},
  handleClearImage = () => {},
  placeholder = null,
}) => {
  // Maximum file size in bytes (2 MB)
  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  // Allowed file types
  const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

  // Validation Schema
  const validationSchema = Yup.object({
    image: Yup.mixed()
      .required("Image is required")
      .test(
        "fileSize",
        "File size is too large (Max: 2MB)",
        (value) => !value || (value && value.size <= MAX_FILE_SIZE)
      )
      .test(
        "fileType",
        "Unsupported file format. Only JPG, JPEG, and PNG are allowed.",
        (value) => !value || (value && SUPPORTED_FORMATS.includes(value.type))
      ),
  });

  // Form submission
  const handleSubmit = (values) => {};

  return formik ? (
    <Form>
      {/* need to handle this logic it is not working till now */}
      <Box sx={imgHolderStyle} component="label">
        <UploadIcon sx={{ fontSize: "48px", color: "#aaa" }} />
        <Typography
          sx={{ marginTop: "8px", color: "#232323", fontSize: "14px" }}
        >
          {placeholder}
        </Typography>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => {
            setFieldValue("image", event.currentTarget.files[0]);
          }}
        />
      </Box>
      <ErrorMessage
        name="image"
        component="div"
        style={{ color: "red", textAlign: "start", marginTop: "10px" }}
      />

      {values.image && (
        <Typography
          sx={{
            textAlign: "start",
            marginTop: "10px",
            fontSize: "14px",
            color: "#333",
          }}
        >
          {values.image.name}
        </Typography>
      )}
    </Form>
  ) : (
    <Box sx={{ position: "relative" }}>
      <Box sx={imgHolderStyle} component="label">
        {uploadedImage ? (
          // Display the uploaded image
          <img
            src={uploadedImage}
            alt="Uploaded"
            style={{
              maxWidth: "100%",
              maxHeight: "150px",
              borderRadius: "4px",
            }}
          />
        ) : (
          // Display the placeholder
          <>
            <UploadIcon sx={{ fontSize: "48px", color: "#aaa" }} />
            <Typography
              sx={{ marginTop: "8px", color: "#232323", fontSize: "14px" }}
            >
              {placeholder}
            </Typography>
          </>
        )}
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageUpload}
        />
      </Box>
      {uploadedImage && (
        <Box
          onClick={() => handleClearImage()}
          sx={{
            position: "absolute",
            bottom: "3px",
            cursor: "pointer",
            left: "3px",
            background: "white",
            padding: "8px 10px",
            borderRadius: "50%",
          }}
        >
          <Image
            src="/icons/trash-icon.svg"
            width={20}
            height={20}
            alt="trash"
			loading="lazy"
          />
        </Box>
      )}
    </Box>
  );
};

export default ImageUploader;
