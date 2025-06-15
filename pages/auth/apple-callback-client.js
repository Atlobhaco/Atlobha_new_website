// pages/auth/apple-callback-client.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie"; // install with `npm install js-cookie`
import { useRouter } from "next/router";
import { loginSuccess } from "@/redux/reducers/authReducer";

const AppleCallbackClient = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const id_token = Cookies.get("id_token");

    if (!id_token) {
      console.error("No ID token found");
      return;
    }

    // Now send id_token to your backend
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
          dispatch(loginSuccess(data));
          Cookies.remove("id_token"); // clean up
          router.push("/"); // redirect to homepage or dashboard
        } else {
          console.error("Backend login failed:", data);
        }
      } catch (err) {
        console.error("Login error:", err);
      }
    };

    loginWithBackend();
  }, [dispatch, router]);

  return <p>Logging you in with Apple...</p>;
};

export default AppleCallbackClient;
