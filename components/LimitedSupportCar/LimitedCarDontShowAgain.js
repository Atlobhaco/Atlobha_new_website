import useLocalization from "@/config/hooks/useLocalization";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import SharedBtn from "../shared/SharedBtn";
import DialogCentered from "../DialogCentered";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import Image from "next/image";
import SharedCheckbox from "../shared/SharedCheckbox";
import { useSelector } from "react-redux";

function LimitedCarDontShowAgain({ openLimitDontShow, setOpenLimitDontShow }) {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const [getDontShowLocaleStorage, setDontShowLocalStorage] = useState(false);
  const { selectedCar, defaultCar } = useSelector((state) => state.selectedCar);

  useEffect(() => {
    const stored = localStorage.getItem("carLimitSupport");
    if (!stored) {
      setTimeout(() => {
        localStorage?.setItem(
          "carLimitSupport",
          JSON.stringify({
            openedWithChaseNum:
              selectedCar?.chassis_no || defaultCar?.chassis_no,
            enableSpareParts:
              selectedCar?.brand?.enabled_for_spare_parts ||
              defaultCar?.brand?.enabled_for_spare_parts,
            dontShowAgain: "false",
          })
        );
      }, 500);
    } else {
      const parsed = JSON.parse(stored);
      setDontShowLocalStorage(parsed.dontShowAgain === "true");
    }
  }, []);

  const handleClick = () => {
    const stored = localStorage.getItem("carLimitSupport");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const newValue = parsed.dontShowAgain === "true" ? "false" : "true";

        const updated = {
          ...parsed,
          dontShowAgain: newValue,
        };

        localStorage.setItem("carLimitSupport", JSON.stringify(updated));
        setDontShowLocalStorage(newValue === "true");
      } catch (error) {
        console.error(
          "Error parsing carLimitSupport from localStorage:",
          error
        );
      }
    }
  };

  return (
    <DialogCentered
      title={false}
      subtitle={false}
      open={openLimitDontShow}
      setOpen={setOpenLimitDontShow}
      actionsWhenClose={() => {
        const stored = localStorage.getItem("carLimitSupport");

        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            localStorage.setItem(
              "carLimitSupport",
              JSON.stringify({
                ...parsed,
                openedWithChaseNum:
                  selectedCar?.chassis_no || defaultCar?.chassis_no,
              })
            );
          } catch (e) {
            console.error("Error updating openedWithChaseNum:", e);
          }
        }
        setOpenLimitDontShow(false);
      }}
      hasCloseIcon
      content={
        <Box sx={{ textAlign: "center" }}>
          <Image
            src="/icons/limit-support-car.svg"
            alt="limit-car"
            width={135}
            height={120}
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
                padding: isMobile ? "0px 1vw" : "0px 4vw",
                mb: isMobile ? 1 : 2,
              }}
            >
              {t.supportedInOthers}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                padding: isMobile ? "0px 1vw" : "0px 4vw",
                color: "#232323",
                fontWeight: "500",
                fontSize: isMobile ? "12px" : "18px",
              }}
            >
              <SharedCheckbox
                selectedId={getDontShowLocaleStorage}
                handleCheckboxChange={handleClick}
                data={{ id: true }}
                showCircle={false}
              />
              <Box sx={{ mt: 1 }}>{t.dontShowAgain}</Box>
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
              const stored = localStorage.getItem("carLimitSupport");

              if (stored) {
                try {
                  const parsed = JSON.parse(stored);
                  localStorage.setItem(
                    "carLimitSupport",
                    JSON.stringify({
                      ...parsed,
                      openedWithChaseNum:
                        selectedCar?.chassis_no || defaultCar?.chassis_no,
                    })
                  );
                } catch (e) {
                  console.error("Error updating openedWithChaseNum:", e);
                }
              }
              setOpenLimitDontShow(false);
            }}
            className="big-main-btn"
            text="okFine"
          />
        </Box>
      }
    />
  );
}

export default LimitedCarDontShowAgain;
