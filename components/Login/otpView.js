import useLocalization from "@/config/hooks/useLocalization";
import { Box, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import SharedTextField from "../shared/SharedTextField";
import SharedBtn from "../shared/SharedBtn";
import Image from "next/image";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { useLoginUser } from "@/config/network/Shared/AuthHelpers";
import { useDispatch } from "react-redux";
import { useAuth } from "@/config/providers/AuthProvider";

function OtpView({
  containerStyle,
  setOtpView,
  recallReqOtp,
  otpLoad,
  setTimer,
  timer,
  otpPayload,
  setOpen,
  textInput,
}) {
  const { t, locale } = useLocalization();
  const dispatch = useDispatch();
  const { login } = useAuth();

  const { isMobile } = useScreenSize();
  const [otpCode, setOtpCode] = useState("");
  const [isBlinking, setIsBlinking] = useState(false); // State for blinking effect

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

  const {
    data: loginRes,
    refetch: recallLogin,
    isFetching: loginFetching,
  } = useLoginUser({
    setOtpView,
    otpPayload,
    t,
    otpCode,
    setOpen,
    dispatch,
	login
  });

  return (
    <>
      <Box
        sx={{
          mb: 3,
        }}
      >
        <Image
          alt="back"
          src={"/icons/arrow_right.svg"}
          width={26}
          height={26}
          onClick={() => setOtpView(false)}
          style={{
            cursor: "pointer",
            transform: locale === "en" ? "rotate(180deg)" : "none", // Rotate 180 degrees for Arabic
          }}
        />
      </Box>

      <Box sx={containerStyle}>
        <Box
          sx={{
            color: "#1C1C28",
            fontSize: "20px",
            fontWeight: "500",
            textAlign: "center",
            mb: 5,
            mx: isMobile ? 2 : 0,
          }}
        >
          {textInput ? t.checkOtpEmail : t.checkOtp}
        </Box>
        <Box
          sx={{
            mb: 5,
          }}
        >
          <SharedTextField
            placeholder={null}
            label={false}
            imgIcon={false}
            value={otpCode}
            handleChange={(e) => setOtpCode(e?.target?.value)}
          />
        </Box>
        <Box
          sx={{
            color: "#1C1C28",
            fontSize: "16px",
            fontWeight: "500",
            textAlign: "center",
            mb: 5,
          }}
        >
          <Box
            component="span"
            sx={{
              cursor: !timer ? "pointer" : "default",
              opacity: !timer ? 1 : 0.6,
              animation: isBlinking ? "blink 1s infinite" : "none",
            }}
            onClick={() =>
              !timer && !otpLoad && !loginFetching && recallReqOtp()
            }
          >
            {t.resendOtp}{" "}
            {otpLoad && <CircularProgress color="inherit" size={12} />}
          </Box>
          <Box
            component="span"
            sx={{
              mx: 1,
              color: "#EE772F",
            }}
          >
            {formatTime(timer)}
          </Box>
        </Box>
        <Box>
          <SharedBtn
            disabled={!otpCode || otpCode?.length <= 5 || loginFetching}
            text={loginFetching ? null : "common.check"}
            compBeforeText={
              loginFetching ? (
                <CircularProgress color="inherit" size={20} />
              ) : null
            }
            className="black-btn"
            customClass="w-100 mb-5"
            type="button"
            onClick={() => recallLogin()}
          />
        </Box>
      </Box>
      <style jsx>{`
        @keyframes blink {
          0% {
            opacity: 1;
          }
          25% {
            opacity: 0.5;
          }
          50% {
            opacity: 0;
          }
          75% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

export default OtpView;
