import DialogCentered from "@/components/DialogCentered";
import useLocalization from "@/config/hooks/useLocalization";
import { toggleMergeEmail } from "@/redux/reducers/mergeEmailExistReducer";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import MergeEmailScreenOrNot from "./MergeEmailScreenOrNot";
import ConfirmOtpForEmailMerge from "./ConfirmOtpForEmailMerge";
import useCustomQuery from "@/config/network/Apiconfig";
import { EMAIL, OTP } from "@/config/endPoints/endPoints";
import { toast } from "react-toastify";

function MergeEmailExist() {
  const { openMergeEmail } = useSelector((state) => state.mergeEmailExist);
  const dispatch = useDispatch();
  const { t } = useLocalization();
  const [stepCount, setStepCount] = useState(120);
  const [timer, setTimer] = useState(5);

  const { emailforMerge } = useSelector((state) => state.mergeEmailExist);

  const { refetch: recallReqOtp, isFetching: checkOtpLoad } = useCustomQuery({
    name: ["sendOtpToEmailMerge"],
    url: `${OTP}${EMAIL} `,
    refetchOnWindowFocus: false,
    method: "post",
    body: { email: emailforMerge },
    select: (res) => res?.data?.data,
    enabled: false,
    retry: 0,
    onSuccess: (res) => {
      //   setOtpView(true);
      setTimer(120);
      //   setOtpPayload({
      //     otp: null,
      //     type: changedField?.type,
      //   });
    },
    onError: (err) => {
      toast.error(t.OtpHourlyExceed);
      //   setChangedField(false);
      //   setOtpPayload(false);
    },
  });

  const renderSteps = () => {
    return stepCount === 1 ? (
      <MergeEmailScreenOrNot
        setStepCount={setStepCount}
        recallReqOtp={recallReqOtp}
      />
    ) : (
      <ConfirmOtpForEmailMerge
        setTimer={setTimer}
        timer={timer}
        checkOtpLoad={checkOtpLoad}
        recallReqOtp={recallReqOtp}
      />
    );
  };
  return (
    <DialogCentered
      open={openMergeEmail}
      setOpen={(val) => {
        setStepCount(1);
        dispatch(toggleMergeEmail(val));
      }}
      subtitle={false}
      title={stepCount === 1 ? t.mergeAccount : t.confirmPhone}
      hasCloseIcon
      content={renderSteps()}
    />
  );
}

export default MergeEmailExist;
