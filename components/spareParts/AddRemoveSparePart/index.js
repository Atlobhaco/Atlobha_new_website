import { Box } from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import SvgIcon from "@mui/material/SvgIcon";

import React from "react";
import useScreenSize from "@/constants/screenSize/useScreenSize";

const CustomDeleteIcon = ({ iconStyle }) => {
  return (
    <SvgIcon
      sx={{
        ...iconStyle,
        color: "#EB3C24",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="28"
        viewBox="0 0 25 28"
        fill="none"
      >
        <path
          d="M1.44141 6.47379H3.90193M3.90193 6.47379H23.5861M3.90193 6.47379L5.1322 23.6975C5.1322 24.35 5.39143 24.9759 5.85287 25.4373C6.31431 25.8988 6.94015 26.158 7.59272 26.158H17.4348C18.0874 26.158 18.7132 25.8988 19.1747 25.4373C19.6361 24.9759 19.8954 24.35 19.8954 23.6975L21.1256 6.47379M7.59272 6.47379V4.01326C7.59272 3.36069 7.85196 2.73484 8.31339 2.27341C8.77483 1.81197 9.40068 1.55273 10.0532 1.55273H14.9743C15.6269 1.55273 16.2527 1.81197 16.7142 2.27341C17.1756 2.73484 17.4348 3.36069 17.4348 4.01326V6.47379M10.0532 12.6251V20.0067M14.9743 12.6251V20.0067"
          stroke="currentColor"
          strokeWidth="2.27126"
          stroke-line-cap="round"
          stroke-line-join="round"
        />
      </svg>
    </SvgIcon>
  );
};

function AddRemoveSparePart() {
  const { isMobile } = useScreenSize();

  const iconStyle = {
    cursor: "pointer",
    width: isMobile ? "13px" : "15px",
    height: isMobile ? "13px" : "15px",
    // "&:hover": {
    //   color: "yellow",
    // },
  };
  return (
    <Box>
      <Box
        sx={{
          mb: isMobile ? 0 : 1,
          fontSize: isMobile ? "14px" : "16px",
          fontWeight: "500",
        }}
      >
        المصد الأمامي لسيارة كامري
      </Box>
      <Box
        sx={{
          background: "white",
          borderRadius: "10px",
          border: "1.2px solid #D1D5DB",
          height: isMobile ? "31px" : "37px",
          width: isMobile ? "90px" : "112px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "8px 11px" : "9px 13px",
        }}
      >
        <CustomDeleteIcon iconStyle={iconStyle} />
        {/* <Remove sx={iconStyle} onClick={() => alert("cl")} /> */}
        <Box
          sx={{
            fontSize: isMobile ? "16px" : "19px",
            fontWeight: "400",
            paddingTop: "8px",
            color: "#1FB256",
          }}
        >
          43
        </Box>{" "}
        <Add sx={iconStyle} onClick={() => alert("cl")} />
      </Box>
    </Box>
  );
}

export default AddRemoveSparePart;
