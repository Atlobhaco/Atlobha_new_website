import { Box } from "@mui/material";
import React, { useState } from "react";
import ErrorIcon from "@mui/icons-material/Error";
import useLocalization from "@/config/hooks/useLocalization";
import Image from "next/image";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import DialogCentered from "../DialogCentered";
import ServiceStoreSelections from "../ServiceDetails/ServiceStoreSelections";
import Login from "../Login";
import LoginModalActions from "@/constants/LoginModalActions/LoginModalActions";

function ServiceCenterInstallment({
  prod,
  hideTitleDesign = false,
  open, // ✅ optional: control from parent
  setOpen, // ✅ optional: control from parent
  triggerFromParent = false, // ✅ if true, parent handles open/close
  setActiveServiceCenter = () => {},
}) {
  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();

  // Local state only used if parent does NOT control it
  const [internalOpen, setInternalOpen] = useState(false);
  const actualOpen = triggerFromParent ? open : internalOpen;
  const actualSetOpen = triggerFromParent ? setOpen : setInternalOpen;

  const { setOpenLogin, showBtn, openLogin } = LoginModalActions();

  const boxStyle = {
    borderBottom: "0.5px solid #1FB256",
    borderTop: "0.5px solid #1FB256",
    background: "#E9FAEF",
    padding: isMobile ? "8px 3px" : "15px 20px",
    color: "#1FB256",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  };

  return (
    <>
      {!hideTitleDesign && (
        <Box sx={boxStyle} onClick={() => actualSetOpen(true)}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ErrorIcon sx={{ color: "#1FB256", marginInlineEnd: "4px" }} />
            <Box sx={{ pt: isMobile ? 0 : 1 }}>{t.InstallmentAtCenter}</Box>
          </Box>
          <Image
            alt="img"
            src={"/icons/green-left-arrow.svg"}
            width={isMobile ? 18 : 28}
            height={isMobile ? 18 : 15}
            loading="lazy"
            style={{
              transform: locale === "ar" ? "rotate(0deg)" : "rotate(180deg)",
            }}
          />
        </Box>
      )}

      <DialogCentered
        title={null}
        subtitle={false}
        open={actualOpen}
        setOpen={actualSetOpen}
        hasCloseIcon
        actionsWhenClose={() => setActiveServiceCenter(null)}
        content={
          <ServiceStoreSelections
            prod={prod}
            selectNewDate={null}
            handleDateChange={() => {}}
            selectedStore={null}
            setSelectedStore={() => {}}
            selectedStoreTime={null}
            setSelectedStoreTime={() => {}}
            setOpenLogin={setOpenLogin}
            setAllStores={() => {}}
            setUserConfirmStoreDate={() => {}}
            userConfirmStoreDate={false}
            setSelectNewDate={() => {}}
            workWithProduct={true}
          />
        }
      />

      <Login
        showBtn={!showBtn}
        open={openLogin}
        setOpen={setOpenLogin}
        id="sixhLogin"
        customIDOtpField="sixOtpField"
        customIDLogin="sixBtnLogin"
      />
    </>
  );
}

export default ServiceCenterInstallment;
