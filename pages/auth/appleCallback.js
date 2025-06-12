// pages/auth/appleCallback.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { loginSuccess } from "@/redux/reducers/authReducer";
import { useDispatch } from "react-redux";

const AppleCallback = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    // This runs after Apple POSTs the form to this page.
    // The form fields are auto-submitted to the window using the hidden form below.
    const form = document.getElementById("appleForm");

    if (form) {
      const formData = new FormData(form);
      const id_token = formData.get("id_token");
      const code = formData.get("code"); // Optional, if you want it
      const state = formData.get("state");

      if (id_token) {
        // You can now send the token to your backend
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/apple`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "w123",
          },
          body: JSON.stringify({ id_token }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data?.data?.user?.id || data?.data?.user?.name) {
              dispatch(loginSuccess(data));
              const url = localStorage.getItem("urlRedirectAfterSuccess");
              router.push(
                `${url ? `${url}?socialLogin=true` : "/?socialLogin=true"}`
              );
              setTimeout(() => {
                // showUniqueToast(t.loginSuccess); // Use the unique toast function
                window.location.reload();
              }, 1000);
              setTimeout(() => {
                localStorage.removeItem("urlRedirectAfterSuccess");
              }, 3000);
            }
          })
          .catch((err) => console.error("Apple login error", err));
      }
    }
  }, [router]);

  return (
    <div>
      <p>Signing you in with Apple...</p>

      {/* This hidden form gets auto-filled by Apple and submitted via POST */}
      <form id="appleForm" method="post">
        <input type="hidden" name="id_token" />
        <input type="hidden" name="code" />
        <input type="hidden" name="state" />
      </form>
    </div>
  );
};

export default AppleCallback;
