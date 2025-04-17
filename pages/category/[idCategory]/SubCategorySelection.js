import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import React from "react";

function SubCategorySelection({
  subCategories,
  subCatId,
  setSubCatId,
  setPage,
}) {
  const { isMobile } = useScreenSize();

  return (
    <Box
      sx={{
        display: "flex",
        gap: isMobile ? "10px" : "15px",
        overflow: "auto hidden",
      }}
    >
      {subCategories?.map((subCat) => (
        <Box
          key={subCat?.id}
          sx={{
            padding: isMobile ? "6px 10px" : "8px 15px",
            background: +subCat?.id === +subCatId ? "#232323" : "#E9E9E9",
            borderRadius: "10px",
            fontSize: isMobile ? "12px" : "18px",
            fontWeight: "500",
            color: +subCat?.id === +subCatId ? "white" : "black",
            minWidth: "fit-content",
            cursor: "pointer",
            "&:hover": {
              opacity: "0.8",
            },
          }}
          onClick={() => {
            setSubCatId(subCat?.id);
            setPage(1);
          }}
        >
          {subCat?.name}
        </Box>
      ))}
    </Box>
  );
}

export default SubCategorySelection;
