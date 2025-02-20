import { AUTH, LOGIN, OTP } from "@/config/endPoints/endPoints";
import { toast } from "react-toastify";
import useCustomQuery from "../Apiconfig";
import { loginSuccess } from "@/redux/reducers/authReducer";

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
      window.webengage.onReady(() => {
        console.log("✅ WebEngage is ready!", res);

        webengage.user.login(res?.user?.id); //9SBOkLVMWvPX is the unique user identifier being used here
        webengage.user.setAttribute("we_email", res?.user?.email || "");
        webengage.user.setAttribute(
          "we_birth_date",
          res?.user?.birthdate || ""
        );
        webengage.user.setAttribute("we_first_name", res?.user?.name || "");
        webengage.user.setAttribute("we_phone", res?.user?.phone || "");

        console.log("✅ User registered successfully in WebEngage!");
      });
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
