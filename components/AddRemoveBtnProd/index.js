import { Box } from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import SvgIcon from "@mui/material/SvgIcon";

import React from "react";
import useLocalization from "@/config/hooks/useLocalization";

const CustomDeleteIcon = ({ iconStyle }) => {
  return (
    <SvgIcon sx={iconStyle}>
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

function AddRemoveBtn({ prod, hasNum = false }) {
  const { locale } = useLocalization();

  const btnStyle = {
    background: "black",
    color: "white",
    position: "absolute",
    borderRadius: "2460px",
    minWidth: "55px",
    height: "55px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "27px",
    ...(locale === "ar" ? { left: "15px" } : { right: "15px" }),
    bottom: "-22px",
  };

  const iconStyle = {
    cursor: "pointer",
    "&:hover": {
      color: "yellow",
    },
  };

  return (
    <Box sx={btnStyle}>
      {hasNum ? (
        <Box
          sx={{
            display: "flex",
            width: "184px",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Box>
            {/* <CustomDeleteIcon iconStyle={iconStyle} /> */}
            <Remove sx={iconStyle} onClick={() => alert("cl")} />
          </Box>
          <Box
            sx={{
              fontSize: "34px",
              fontWeight: "500",
              paddingTop: "11px",
            }}
          >
            43
          </Box>
          <Box>
            <Add sx={iconStyle} onClick={() => alert("cl")} />
          </Box>
        </Box>
      ) : (
        <Box>
          <Add sx={iconStyle} onClick={() => alert("cl")} />
        </Box>
      )}
    </Box>
  );
}

export default AddRemoveBtn;
