// // pages/auth/appleCallback.js
// import { useEffect } from "react";
// import { useRouter } from "next/router";
// import { loginSuccess } from "@/redux/reducers/authReducer";
// import { useDispatch } from "react-redux";

// const AppleCallback = () => {
//   const router = useRouter();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     // This runs after Apple POSTs the form to this page.
//     // The form fields are auto-submitted to the window using the hidden form below.
//     const form = document.getElementById("appleForm");

//     if (form) {
//       const formData = new FormData(form);
//       const id_token = formData.get("id_token");
//       const code = formData.get("code"); // Optional, if you want it
//       const state = formData.get("state");

//       if (id_token) {
//         // You can now send the token to your backend
//         fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/apple`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "x-api-key": "w123",
//           },
//           body: JSON.stringify({ id_token }),
//         })
//           .then((res) => res.json())
//           .then((data) => {
//             if (data?.data?.user?.id || data?.data?.user?.name) {
//               dispatch(loginSuccess(data));
//               const url = localStorage.getItem("urlRedirectAfterSuccess");
//               router.push(
//                 `${url ? `${url}?socialLogin=true` : "/?socialLogin=true"}`
//               );
//               setTimeout(() => {
//                 // showUniqueToast(t.loginSuccess); // Use the unique toast function
//                 window.location.reload();
//               }, 1000);
//               setTimeout(() => {
//                 localStorage.removeItem("urlRedirectAfterSuccess");
//               }, 3000);
//             }
//           })
//           .catch((err) => console.error("Apple login error", err));
//       }
//     }
//   }, [router]);

//   return (
//     <div>
//       <p>Signing you in with Apple...</p>

//       {/* This hidden form gets auto-filled by Apple and submitted via POST */}
//       <form id="appleForm" method="post">
//         <input type="hidden" name="id_token" />
//         <input type="hidden" name="code" />
//         <input type="hidden" name="state" />
//       </form>
//     </div>
//   );
// };

// export default AppleCallback;

// pages/auth/appleCallback.js
// import { useEffect } from "react";
// import { useRouter } from "next/router";
// import { useDispatch } from "react-redux";
// import { loginSuccess } from "@/redux/reducers/authReducer";

// const AppleCallback = () => {
//   const router = useRouter();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const form = document.getElementById("appleForm");
//     if (!form) return;

//     const formData = new FormData(form);
//     const id_token = formData.get("id_token");
//     const code = formData.get("code");
//     const state = formData.get("state");

//     if (id_token) {
//       // Send to your backend to verify and login
//       fetch("/api/appleRedirect", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ id_token }),
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           if (data?.data?.user?.id) {
//             dispatch(loginSuccess(data));

//             const cookies = document.cookie
//               .split(";")
//               .map((cookie) => cookie.trim())
//               .reduce((acc, cookie) => {
//                 const [key, value] = cookie.split("=");
//                 acc[key] = decodeURIComponent(value);
//                 return acc;
//               }, {});

//             const redirectUrl = cookies.urlRedirectAfterSuccess || "/";

//             router.replace(`${redirectUrl}?socialLogin=true`);

//             setTimeout(() => {
//               localStorage.removeItem("urlRedirectAfterSuccess");
//               document.cookie =
//                 "urlRedirectAfterSuccess=; Max-Age=0; path=/;";
//               window.location.reload();
//             }, 1000);
//           } else {
//             router.push("/auth/login?error=apple_login_failed");
//           }
//         })
//         .catch((err) => {
//           console.error("Apple login error:", err);
//           router.push("/auth/login?error=apple_login_failed");
//         });
//     }
//   }, [router, dispatch]);

//   return (
//     <div>
//       <p>Signing you in with Apple...</p>
//       <form id="appleForm" method="post">
//         <input type="hidden" name="id_token" />
//         <input type="hidden" name="code" />
//         <input type="hidden" name="state" />
//       </form>
//     </div>
//   );
// };

// export default AppleCallback;

// // ------------------------------

import { useEffect } from "react";
import { useRouter } from "next/router";
import { loginSuccess } from "@/redux/reducers/authReducer";
import { useDispatch } from "react-redux";

const AppleCallback = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  alert("rendered");

  useEffect(() => {
    const form = document.forms?.[0]; // Apple posts the form

    if (form) {
      const formData = new FormData(form);
      const id_token = formData.get("id_token");
      alert("id_token", id_token);
      if (id_token) {
        fetch("/api/auth/apple", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "w123",
          },
          body: JSON.stringify({ id_token }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data?.data?.user?.id) {
              dispatch(loginSuccess(data));
              const redirect = localStorage.getItem("urlRedirectAfterSuccess");
              router.replace(redirect || "/");
              localStorage.removeItem("urlRedirectAfterSuccess");
            } else {
              router.replace("/auth/login?error=apple_login_failed");
            }
          })
          .catch((e) => {
            console.error("Apple login error:", e);
            router.replace("/auth/login?error=apple_internal");
          });
      }
    }
  }, []);

  return (
    <div>
      <p>Processing your Apple sign in...</p>
      <form method="post">
        <input type="hidden" name="id_token" />
        <input type="hidden" name="code" />
        <input type="hidden" name="state" />
      </form>
    </div>
  );
};

export default AppleCallback;
