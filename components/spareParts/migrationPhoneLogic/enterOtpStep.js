import SharedBtn from "@/components/shared/SharedBtn";
import SharedTextField from "@/components/shared/SharedTextField";
import { ME, PHONE } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { useAuth } from "@/config/providers/AuthProvider";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, CircularProgress, Divider } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

const closeHolder = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
};

function EnterOtpStep({
  timer,
  setTimer,
  callOtpRequest,
  otpLoad,
  setOpenAddMobile,
  phoneNum,
  setMigrationStep,
  canUsePhone,
  setOtpCode,
  otpCode,
  callOtpRequest409,
  otpLoad409,
  setPhoneNum,
  setRecallUserDataAgain = () => {},
}) {
  const { login, user } = useAuth();
  const router = useRouter();
  const { route } = router;
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();

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
    }
    return () => clearInterval(countdown); // Clear the interval when the component unmounts
  }, [timer]);

  const {
    data,
    isLoading: checkOtpLoad,
    refetch: checkOtpRequest,
  } = useCustomQuery({
    name: ["checkOtpCanUse"],
    url: `${ME}${PHONE}`,
    refetchOnWindowFocus: false,
    enabled: false,
    method: "patch",
    body: { otp: otpCode, phone: `+966${phoneNum}` },
    retry: 0,
    select: (res) => res?.data?.data,
    onError: (err) => {
      if (err?.status === 409) {
        return toast.error(err?.response?.data?.message);
      }
      toast.error(t.invalidOtp);
    },
    onSuccess: () => {
      if (canUsePhone) {
        const loggedUser = JSON.parse(window?.localStorage.getItem("user"));
        login({
          data: {
            access_token: window?.localStorage.getItem("access_token"),
            user: {
              ...loggedUser,
              phone: `+966${phoneNum}`,
            },
          },
        });
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...loggedUser,
            phone: `+966${phoneNum}`,
          })
        );
        toast.success(
          !route?.includes(`/checkout`) && !route?.includes("chooseGift")
            ? t.canMakeSparePartReq
            : t.canAddOrder
        );
        setOpenAddMobile(false);
        setMigrationStep(1);
        setRecallUserDataAgain(true);
      } else {
        setMigrationStep(2);
      }
    },
  });

  return (
    <Box>
      {isMobile ? (
        <Box sx={closeHolder}>
          <Image
            loading="lazy"
            onClick={() => {
              setOpenAddMobile(false);
              setMigrationStep(1);
              setOtpCode("");
              setPhoneNum(false);
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
              if (canUsePhone) {
                !timer && !otpLoad && callOtpRequest();
              } else {
                !timer && !otpLoad409 && callOtpRequest409();
              }
            }}
          >
            {t.resendOtpAgain}{" "}
            {(otpLoad || otpLoad409) && (
              <CircularProgress color="inherit" size={12} />
            )}
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
            onClick={() =>
              canUsePhone ? checkOtpRequest() : setMigrationStep(2)
            }
          />
        </Box>
      </Box>
    </Box>
  );
}

export default EnterOtpStep;
