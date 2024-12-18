import { Box } from "@mui/material";
import React from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import SparePartItem from "./SparePartItem";

function AddsparePart() {
  const { isMobile } = useScreenSize();
  return (
    <Box
      sx={{
        background: isMobile ? "white" : "#F8F8F8",
        padding: "15px",
		borderRadius: !isMobile ? "20px" : "unset",
        borderBottom: isMobile ? "3px solid #F8F8F8" : "unset",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            fontSize: isMobile ? "16px" : "20px",
            fontWeight: "500",
          }}
        >
          بيانات قطع الغيار
        </Box>
        <Box
          sx={{
            fontSize: isMobile ? "14px" : "16px",
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
            }}
          />
          <Box
            sx={{
              pt: 1,
            }}
            component="span"
          >
            أضف قطعة غيار
          </Box>
        </Box>
      </Box>
      <Box sx={{ mt: 2 }}>
        {["1", "2", "3"]?.map(() => (
          <SparePartItem />
        ))}
      </Box>
    </Box>
  );
}

export default AddsparePart;
