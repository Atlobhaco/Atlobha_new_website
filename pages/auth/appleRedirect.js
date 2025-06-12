// pages/auth/appleRedirect.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/reducers/authReducer";

const AppleRedirect = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const cookieMatch = document.cookie
        .split("; ")
        .find((row) => row.startsWith("apple_user="));

      if (!cookieMatch) {
        console.warn("No user cookie found after Apple login.");
        router.push("/auth/login?error=missing_user");
        return;
      }

      const userJson = decodeURIComponent(cookieMatch.split("=")[1]);
      const userData = JSON.parse(userJson);

      dispatch(loginSuccess(userData));

      // Clear cookie after use
      document.cookie = "apple_user=; Max-Age=0; path=/";

      // Redirect to original page or home
      const redirectUrl = router.query.redirect || "/";
      router.replace(`${redirectUrl}?socialLogin=true`);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error("Apple redirect error:", err);
      router.push("/auth/login?error=redirect_failed");
    }
  }, [dispatch, router]);

  return <p>Finalizing login...</p>;
};

export default AppleRedirect;
