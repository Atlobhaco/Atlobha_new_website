import { Box } from "@mui/material";
import React from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import SparePartItem from "./SparePartItem";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedSparePart } from "@/redux/reducers/addSparePartsReducer";
import useLocalization from "@/config/hooks/useLocalization";

function AddsparePart({ setOpenPricingDialog }) {
  const dispatch = useDispatch();
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const { selectedParts } = useSelector((state) => state.addSpareParts);

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
          mb: selectedParts?.length ? 3 : 0,
        }}
      >
        <Box
          sx={{
            fontSize: isMobile ? "15px" : "20px",
            fontWeight: "500",
          }}
        >
          {t.sparePartsDetaiils}
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
            onClick={() => setOpenPricingDialog(true)}
            sx={{
              pt: isMobile ? 0 : 1,
            }}
            component="span"
          >
            {t.addSparePart}
          </Box>
        </Box>
      </Box>
      <Box sx={{ mt: selectedParts?.length ? 2 : 0 }}>
        {selectedParts?.map((data) => (
          <SparePartItem data={data} />
        ))}
      </Box>
    </Box>
  );
}

export default AddsparePart;
