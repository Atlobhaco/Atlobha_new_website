import {
  AUTH,
  LOGIN,
  LOOKUPS,
  OTP,
  REGISTER,
} from "@/config/endPoints/endPoints";
import { toast } from "react-toastify";
import useCustomQuery from "../Apiconfig";
import { loginSuccess } from "@/redux/reducers/authReducer";

export function useRequestOtp({
  setOtpView,
  otpPayload,
  t,
  recallRegister,
  setTimer,
}) {
  return useCustomQuery({
    name: ["requestOtpForLogin", otpPayload],
    url: `${AUTH}${OTP}`,
    refetchOnWindowFocus: false,
    enabled: false,
    method: "post",
    body: otpPayload,
    retry: 0,
    select: (res) => res?.data?.data,
    onSuccess: () => {
      setOtpView(true);
      setTimer(120);
    },
    onError: (err) => {
      if (+err?.status === 400 || +err?.status === 404) {
        recallRegister();
      } else {
        toast.error(
          err?.response?.data?.first_error ||
            err?.response?.data?.message ||
            t.someThingWrong
        );
      }
    },
  });
}

export function useRegisterUser({ setOtpView, otpPayload, t }) {
  return useCustomQuery({
    name: "registerNewUser",
    url: `${AUTH}${REGISTER}`,
    refetchOnWindowFocus: false,
    method: "post",
    body: otpPayload,
    enabled: false,
    retry: 0,
    select: (res) => res,
    onSuccess: (res) => {
      setOtpView(true);
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.first_error ||
          err?.response?.data?.message ||
          t.someThingWrong
      );
    },
  });
}

export function useLoginUser({
  setOtpView,
  otpPayload,
  otpCode,
  t,
  setOpen,
  dispatch,
  login = () => {},
}) {
  return useCustomQuery({
    name: "LoginUser",
    url: `${AUTH}${LOGIN}`,
    refetchOnWindowFocus: false,
    method: "post",
    body: { ...otpPayload, password: otpCode },
    enabled: false,
    retry: 0,
    select: (res) => res?.data?.data,
    onSuccess: (res) => {
      login({ data: res });
      setOtpView(false);
      setOpen(false);
      dispatch(loginSuccess({ data: res }));
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.first_error ||
          err?.response?.data?.message ||
          t.someThingWrong
      );
    },
  });
}
