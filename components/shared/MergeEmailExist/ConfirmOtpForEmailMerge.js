import { EMAIL, ME } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, CircularProgress, Divider } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SharedTextField from "../SharedTextField";
import SharedBtn from "../SharedBtn";

const closeHolder = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
};

function ConfirmOtpForEmailMerge({
  setTimer,
  timer,
  checkOtpLoad,
  recallReqOtp,
}) {
  const [otpCode, setOtpCode] = useState("");
  const [isBlinking, setIsBlinking] = useState(false); // State for blinking effect
  const { emailforMerge } = useSelector((state) => state.mergeEmailExist);
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();

  /* -------------------------------------------------------------------------- */
  /*                         confirm otp for merge email                        */
  /* -------------------------------------------------------------------------- */
  const { refetch: editPhoneOrEmail, isFetching: confirmOtpFetch } =
    useCustomQuery({
      name: ["ConfirmOtpForMergeEmail"],
      url: `${ME}${EMAIL} `,
      refetchOnWindowFocus: false,
      method: "patch",
      body: { email: emailforMerge, otp: otpCode },
      select: (res) => res?.data?.data,
      retry: 0,
      enabled: false,
      onSuccess: (res) => {
        // setOtpView(false);
        // setMigrationStep(false);
        // toast.success(t.confirmedSuccess);
        // setChangedField(false);
        // setOtpPayload(false);
      },
      onError: (err) => {
        // if (err?.response?.status === 409) {
        //   toast.error(t.phoneUsedForMerge);
        //   setMigrationStep(true);
        //   setOtpView(true);
        //   return null;
        // }
        // if (err?.response?.data?.first_error?.includes("email_taken")) {
        //   dispatch(toggleMergeEmail());
        //   dispatch(setEmailForMerge(changedField["value"]));
        //   setOtpView(false);
        //   setMigrationStep(false);
        //   setChangedField(false);
        //   setOtpPayload(false);
        // } else {
        toast.error(err?.response?.data?.first_error || t.someThingWrong);
        // }
      },
    });

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsBlinking(true); // Start blinking when the timer reaches 0
    }
    return () => clearInterval(countdown); // Clear the interval when the component unmounts
  }, [timer]);

  useEffect(() => {
    let blinkInterval;
    if (isBlinking) {
      blinkInterval = setInterval(() => {
        setIsBlinking((prev) => !prev); // Toggle blinking effect
      }, 1000);
    }
    return () => clearInterval(blinkInterval); // Clear blinking interval on unmount
  }, [isBlinking]);

  //  auto confirm otp
  useEffect(() => {
    if (otpCode?.length === 6) {
      setTimeout(() => {
        editPhoneOrEmail();
      }, 500);
    }
  }, [otpCode]);

  return (
    <Box>
      {isMobile ? (
        <Box sx={closeHolder}>
          <Image
            loading="lazy"
            onClick={() => {
              //   setOpenAddMobile(false);
              //   setMigrationStep(1);
              //   setOtpCode("");
              //   setPhoneNum(false);
            }}
            style={{
              cursor: "pointer",
            }}
            src="/icons/close-circle.svg"
            alt="close"
            width={34}
            height={34}
          />
        </Box>
      ) : (
        <Divider></Divider>
      )}{" "}
      <Box
        className={`d-flex align-items-center justify-content-center ${
          isMobile ? "mt-0" : "mt-4"
        } flex-column`}
      >
        {!isMobile && (
          <Image
            loading="lazy"
            src="/imgs/add-phone.svg"
            width={122}
            height={102}
            alt="add-phone"
          />
        )}
        <Box
          sx={{
            fontSize: "24px",
            fontWeight: "700",
            mt: isMobile ? 1 : 2,
            color: "#1C1C28",
            textAlign: isMobile ? "start" : "center",
            width: "100%",
          }}
        >
          {t.confirmYouPhone}
        </Box>
        <Box
          sx={{
            fontSize: isMobile ? "14px" : "20px",
            fontWeight: "400",
            mt: isMobile ? 1 : 2,
            color: "#1C1C28",
            textAlign: isMobile ? "start" : "center",
            width: "100%",
          }}
        >
          {t.enterOtpSendto}
        </Box>
        <Box sx={{ mt: 2, width: isMobile ? "100%" : "70%" }}>
          <SharedTextField
            id="otpStepField"
            placeholder={null}
            label={false}
            imgIcon={false}
            value={otpCode}
            handleChange={(e) => {
              setOtpCode(e?.target?.value);
            }}
          />
        </Box>

        <Box
          sx={{
            color: "#0F172A",
            fontSize: "14px",
            fontWeight: "500",
            textAlign: "center",
            mb: 1,
          }}
        >
          <Box
            component="span"
            sx={{
              cursor: !timer ? "pointer" : "default",
              opacity: !timer ? 1 : 0.6,
            }}
            onClick={() => {
              if (!timer && !checkOtpLoad) {
                recallReqOtp();
              }
            }}
          >
            {t.resendOtpAgain}{" "}
            {false && <CircularProgress color="inherit" size={12} />}
          </Box>
          <Box
            component="span"
            sx={{
              mx: 1,
              color: "#FFD400",
            }}
          >
            {formatTime(timer)}
          </Box>
        </Box>

        <Box sx={{ width: isMobile ? "100%" : "70%" }}>
          <SharedBtn
            disabled={
              !otpCode ||
              otpCode?.length <= 5 ||
              otpCode?.length > 6 ||
              checkOtpLoad
            }
            text={checkOtpLoad ? null : "activate"}
            compBeforeText={
              checkOtpLoad ? (
                <CircularProgress color="inherit" size={20} />
              ) : null
            }
            className="big-main-btn"
            customClass="w-100"
            type="button"
            // onClick={() =>
            //   canUsePhone ? checkOtpRequest() : setMigrationStep(2)
            // }
          />
        </Box>
      </Box>
    </Box>
  );
}

export default ConfirmOtpForEmailMerge;
