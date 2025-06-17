import useLocalization from "@/config/hooks/useLocalization";
import { Box } from "@mui/material";
import React from "react";
import SharedBtn from "../shared/SharedBtn";
import DialogCentered from "../DialogCentered";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import Image from "next/image";

function LimitedSupportCar({ openLimitSupport, setOpenLimitSupport }) {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  return (
    <DialogCentered
      title={false}
      subtitle={false}
      open={openLimitSupport}
      setOpen={setOpenLimitSupport}
      hasCloseIcon
      content={
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <Image
            src="/icons/limit-support-car.svg"
            alt="limit-car"
            width={135}
            height={120}
            loading="lazy"
          />
          <Box
            sx={{
              margin: "20px 0px",
              color: "#1C1C28",
              fontSize: "24px",
              fontWeight: "700",
              mb: isMobile ? 1 : 2,
            }}
          >
            {t.noticeAboutCar}
          </Box>
          <Box>
            <Box
              sx={{
                color: "#1C1C28",
                fontSize: isMobile ? "12px" : "18px",
                fontWeight: "700",
                mb: isMobile ? 1 : 2,
              }}
            >
              {t.carNotSupported}
            </Box>
            <Box
              sx={{
                color: "#1C1C28",
                fontSize: isMobile ? "12px" : "18px",
                fontWeight: "400",
                padding: "0px 4vw",
                mb: isMobile ? 1 : 2,
              }}
            >
              {t.supportedInOthers}
            </Box>
          </Box>
        </Box>
      }
      renderCustomBtns={
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <SharedBtn
            customStyle={{
              width: isMobile ? "100%" : "50%",
            }}
            onClick={() => {
              setOpenLimitSupport(false);
            }}
            className="big-main-btn"
            text="okFine"
          />
        </Box>
      }
    />
  );
}

export default LimitedSupportCar;
