import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { loginSuccess } from "@/redux/reducers/authReducer";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import useLocalization from "@/config/hooks/useLocalization";

function generateToastId() {
  return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

const GoogleCallback = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useLocalization();
  const [displayedToasts, setDisplayedToasts] = useState(new Set());

  const showUniqueToast = (message) => {
    const toastId = generateToastId();
    if (!displayedToasts.has(toastId)) {
      toast.success(message, { toastId: toastId });
      setDisplayedToasts((prevToasts) => new Set(prevToasts).add(toastId));
    }
  };

  useEffect(() => {
    if (router?.pathname?.includes("callback")) {
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = hashParams.get("id_token");

      if (accessToken) {
        fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`, // Your backend endpoint
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": "w123",
            },
            body: JSON.stringify({ id_token: accessToken }),
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (data?.data?.user?.id || data?.data?.user?.name) {
              dispatch(loginSuccess(data));
              router.push("/?socialLogin=true");
              setTimeout(() => {
                // showUniqueToast(t.loginSuccess); // Use the unique toast function
                window.location.reload();
              }, 1000);
            }
          });
      } else {
        console.error("No access token found");
      }
    }
  }, [router, dispatch, t]);

  return <p>{t.loginSuccess}</p>;
};

export default GoogleCallback;
