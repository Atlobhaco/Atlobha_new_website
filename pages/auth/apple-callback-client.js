// pages/auth/apple-callback-client.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { loginSuccess } from "@/redux/reducers/authReducer";

const AppleCallbackClient = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const { id_token } = router.query;

    if (!id_token) {
      // router.query may be undefined on first render, so wait
      return;
    }

    const loginWithBackend = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/apple`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": "w123",
            },
            body: JSON.stringify({ id_token }),
          }
        );

        const data = await res.json();

        if (res.ok) {
          const url = localStorage.getItem("urlRedirectAfterSuccess");
          dispatch(loginSuccess(data));
          router.push(
            `${url ? `${url}?socialLogin=true` : "/?socialLogin=true"}`
          );

          setTimeout(() => {
            window.location.reload();
          }, 1000);

          setTimeout(() => {
            localStorage.removeItem("urlRedirectAfterSuccess");
          }, 3000);
        } else {
          console.error("Backend login failed:", data);
        }
      } catch (err) {
        console.error("Login error:", err);
      }
    };

    loginWithBackend();
  }, [router.query, dispatch, router]);

  return <p>Logging you in with Apple...</p>;
};

export default AppleCallbackClient;
