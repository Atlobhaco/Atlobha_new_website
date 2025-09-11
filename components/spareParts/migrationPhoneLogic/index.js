import React, { useState } from "react";
import EnterPhoneStep from "./EnterPhoneStep";
import useCustomQuery from "@/config/network/Apiconfig";
import { AUTH, CAN_USE, OTP, PHONE } from "@/config/endPoints/endPoints";
import MergeStep from "./mergeStep";
import EnterOtpStep from "./enterOtpStep";
import { toast } from "react-toastify";
import useLocalization from "@/config/hooks/useLocalization";

function MigrationPhoneLogic({
  migrationStep,
  setMigrationStep,
  setOpenAddMobile,
  otpCode,
  setOtpCode,
  phoneNum,
  setPhoneNum,
  setRecallUserDataAgain = () => {},
}) {
  const { t } = useLocalization();
  const [timer, setTimer] = useState(120);
  const [canUsePhone, setCanUsePhone] = useState(false);

  const { isLoading: canUseLoad, refetch: callCanUSer } = useCustomQuery({
    name: ["canUsePhoneOrNot", phoneNum],
    url: `${PHONE}${CAN_USE}`,
    refetchOnWindowFocus: false,
    method: "post",
    enabled: !!phoneNum,
    body: {
      phone: `+966${phoneNum}`,
    },
    retry: 0,
    select: (res) => res?.data?.data,
    onSuccess: (res) => {
      callOtpRequest();
      setCanUsePhone(true);
    },
    onError: (err) => {
      setCanUsePhone(false);
      if (err?.response?.status === 409) {
        callOtpRequest409();
        toast.error(t.phoneUsedForMerge);
        return null;
      }
      toast.error(err?.response?.data?.message);
    },
  });

  const {
    data,
    isFetching: otpLoad,
    refetch: callOtpRequest,
  } = useCustomQuery({
    name: ["requestOtp"],
    url: `${OTP}${PHONE}`,
    refetchOnWindowFocus: false,
    method: "post",
    enabled: false,
    body: {
      phone: `+966${phoneNum}`,
    },
    retry: 0,
    select: (res) => res?.data?.data,
    onSuccess: (res) => {
      setTimer(120);
      setMigrationStep(3);
    },
    onError: (err) => {
      setCanUsePhone(false);
      if (err?.response?.status === 409) {
        toast.error(t.phoneUsedForMerge);
        return setMigrationStep(2);
      }
      toast.error(err?.response?.data?.message);
    },
  });

  const { isFetching: otpLoad409, refetch: callOtpRequest409 } = useCustomQuery(
    {
      name: ["requestOtpForCanUse409"],
      url: `${AUTH}${OTP}`,
      refetchOnWindowFocus: false,
      method: "post",
      enabled: false,
      body: {
        phone: `+966${phoneNum}`,
      },
      retry: 0,
      select: (res) => res?.data?.data,
      onSuccess: (res) => {
        setTimer(120);
        setCanUsePhone(false);
        setMigrationStep(3);
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message);
      },
    }
  );

  return migrationStep === 1 ? (
    <EnterPhoneStep
      setPhoneNum={setPhoneNum}
      canUseLoad={canUseLoad}
      setOpenAddMobile={setOpenAddMobile}
    />
  ) : migrationStep === 2 ? (
    <MergeStep
      setOpenAddMobile={setOpenAddMobile}
      setMigrationStep={setMigrationStep}
      phoneNum={phoneNum}
      otpCode={otpCode}
      setPhoneNum={setPhoneNum}
      setOtpCode={setOtpCode}
    />
  ) : (
    <EnterOtpStep
      setTimer={setTimer}
      timer={timer}
      callOtpRequest={callOtpRequest}
      otpLoad={otpLoad}
      setOpenAddMobile={setOpenAddMobile}
      phoneNum={phoneNum}
      setMigrationStep={setMigrationStep}
      canUsePhone={canUsePhone}
      setOtpCode={setOtpCode}
      otpCode={otpCode}
      callOtpRequest409={callOtpRequest409}
      otpLoad409={otpLoad409}
      setPhoneNum={setPhoneNum}
      setRecallUserDataAgain={setRecallUserDataAgain}
    />
  );
}

export default MigrationPhoneLogic;
