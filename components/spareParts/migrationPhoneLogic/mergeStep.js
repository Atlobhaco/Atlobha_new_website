import SharedBtn from "@/components/shared/SharedBtn";
import { AUTH, LOGIN, MERGE, USERS } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { useAuth } from "@/config/providers/AuthProvider";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { loginSuccess } from "@/redux/reducers/authReducer";
import { Box, Divider } from "@mui/material";
import Image from "next/image";
import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const closeHolder = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
};

function MergeStep({
  setOpenAddMobile,
  setMigrationStep,
  phoneNum,
  otpCode,
  setPhoneNum,
  setOtpCode,
}) {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const { login } = useAuth();
  const dispatch = useDispatch();

  const {
    data: mergeRes,
    isLoading: checkMergeLoad,
    refetch: mergeRefetch,
  } = useCustomQuery({
    name: "mergeUsers",
    url: `${USERS}${MERGE}`,
    refetchOnWindowFocus: false,
    enabled: false,
    method: "post",
    body: { otp: otpCode, phone: `+966${phoneNum}` },
    retry: 0,
    select: (res) => res?.data?.data,
    onError: (err) => {
      toast.error(err?.response?.data?.message);
    },
    onSuccess: () => {
      loginrefetch();
    },
  });

  const {
    data: loginRes,
    isLoading: cloginLoad,
    refetch: loginrefetch,
  } = useCustomQuery({
    name: "loginAfterMerge",
    url: `${AUTH}${LOGIN}`,
    refetchOnWindowFocus: false,
    enabled: false,
    method: "post",
    body: { password: otpCode, phone: `+966${phoneNum}` },
    retry: 0,
    select: (res) => res?.data?.data,
    onError: (err) => {
      toast.error(err?.response?.data?.message);
      setOpenAddMobile(false);
      setMigrationStep(1);
    },
    onSuccess: (res) => {
      login({ data: res });
      setOpenAddMobile(false);
      setMigrationStep(1);
      dispatch(loginSuccess({ data: res }));
      toast.success(t.canMakeSparePartReq);
    },
  });

  const handleCloseStep = () => {
    setOpenAddMobile(false);
    setMigrationStep(1);
    setPhoneNum(false);
    setOtpCode("");
  };
  return (
    <Box>
      {isMobile ? (
        <Box sx={closeHolder}>
          <Image
            onClick={() => {
              handleCloseStep();
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
        <Image
          src="/imgs/migration.svg"
          width={122}
          height={isMobile ? 158 : 270}
          alt="add-phone"
          style={{
            minWidth: "100%",
          }}
        />
        <Box
          sx={{
            fontSize: isMobile ? "20px" : "24px",
            fontWeight: "700",
            mt: isMobile ? 1 : 2,
            color: "#1C1C28",
            textAlign: "center",
          }}
        >
          {t.numberEnteredBefore}
        </Box>
        <Box
          sx={{
            fontSize: isMobile ? "14px" : "20px",
            fontWeight: "400",
            mt: 1,
            color: "#1C1C28",
          }}
        >
          {t.mergeTwoAccounts}
        </Box>
        <Box
          sx={{
            width: isMobile ? "100%" : "70%",
            mt: isMobile ? 5 : 2,
            display: "flex",
            gap: "10px",
          }}
        >
          <SharedBtn
            id="second-step-confirm"
            text={"ok"}
            className="big-main-btn"
            customClass="w-100"
            onClick={() => mergeRefetch()}
          />
          <SharedBtn
            id="second-step-cancel"
            text={"common.cancel"}
            className="outline-btn"
            customClass="w-100"
            onClick={() => handleCloseStep()}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default MergeStep;