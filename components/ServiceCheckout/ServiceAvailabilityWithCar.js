import { Box } from "@mui/material";
import React from "react";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import SharedBtn from "../shared/SharedBtn";
import useLocalization from "@/config/hooks/useLocalization";

function ServiceAvailabilityWithCar() {
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();

  return (
    <Box
      sx={{
        padding: "16px 9px",
        background: "#FEFCED",
        borderRadius: "10px",
        display: isMobile ? "block" : "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
      }}
    >
      <Box>
        <Box
          sx={{
            color: "#EE772F",
            fontSize: isMobile ? "14px" : "20px",
            fontWeight: "700",
            mx: 4,
            pb: 1,
          }}
        >
          {t.servviceAvailable}
        </Box>{" "}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <ReportProblemIcon
            sx={{
              color: "#EE772F",
              width: isMobile ? "24px" : "35px",
              height: isMobile ? "24px" : "35px",
            }}
          />
          <Box
            sx={{
              color: "#6B7280",
              fontWeight: "500",
              fontSize: isMobile ? "12px" : "16px",
            }}
          >
            {t.carAvailabilityHint}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: isMobile ? "flex" : "block",
          justifyContent: "center",
          mt: isMobile ? 1 : 0,
        }}
      >
        <SharedBtn
          className="black-btn"
          customStyle={{
            padding: "6px 10px",
            height: "unset",
            minWidth: "150px",
          }}
          text="changeCar"
          onClick={() =>
            document?.getElementById("openTheCarSelectionModal")?.click()
          }
        />
      </Box>
    </Box>
  );
}

export default ServiceAvailabilityWithCar;
