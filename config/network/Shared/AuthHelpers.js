import { AUTH, LOGIN, OTP } from "@/config/endPoints/endPoints";
import { toast } from "react-toastify";
import useCustomQuery from "../Apiconfig";
import { loginSuccess } from "@/redux/reducers/authReducer";
import { setUserProperties } from "@/lib/firebase";
import { analytics } from "@/lib/firebase";
import { logEvent } from "firebase/analytics";

export function useRequestOtp({
  setOtpView,
  otpPayload,
  t,
  callRegister,
  setTimer,
}) {
  return useCustomQuery({
    name: ["requestOtpForLogin"],
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
        callRegister();
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
      if (analytics) {
        logEvent(analytics, "LOGIN", {
          email: res?.user?.email || "",
          mobile_number: res?.user?.phone || "",
          user_name: res?.user?.name || "",
          number_of_orders: res?.user?.order_count,
          user_id: res?.user?.id,
        });
      }
      setUserProperties({
        we_phone: res?.user?.phone || "",
        User_ID: res?.user?.id,
        we_email: res?.user?.email || "",
        we_birth_date: res?.user?.birthdate || "",
        we_first_name: res?.user?.name || "",
      });
      if (window.gtag) {
        window.gtag("event", "LOGIN", {
          email: res?.user?.email || "",
          mobile_number: res?.user?.phone || "",
          user_name: res?.user?.name || "",
          number_of_orders: res?.user?.order_count,
          user_id: res?.user?.id,
        });
      }
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.first_error ||
          err?.response?.data?.message ||
          t.someThingWrong,
        { toastId: "uniqueErrorIdLogin" } // Use a unique ID to deduplicate
      );
    },
  });
}
