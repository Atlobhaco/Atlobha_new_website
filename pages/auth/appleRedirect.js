// // pages/auth/appleRedirect.js
// import { useEffect } from "react";
// import { useRouter } from "next/router";
// import { useDispatch } from "react-redux";
// import { loginSuccess } from "@/redux/reducers/authReducer";

// const AppleRedirect = () => {
//   const router = useRouter();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     try {
//       const cookieMatch = document.cookie
//         .split("; ")
//         .find((row) => row.startsWith("apple_user="));

//       if (!cookieMatch) {
//         console.warn("No user cookie found after Apple login.");
//         router.push("/auth/login?error=missing_user");
//         return;
//       }

//       const userJson = decodeURIComponent(cookieMatch.split("=")[1]);
//       const userData = JSON.parse(userJson);

//       dispatch(loginSuccess(userData));

//       // Clear cookie after use
//       document.cookie = "apple_user=; Max-Age=0; path=/";

//       // Redirect to original page or home
//       const redirectUrl = router.query.redirect || "/";
//       router.replace(`${redirectUrl}?socialLogin=true`);
//       setTimeout(() => window.location.reload(), 1000);
//     } catch (err) {
//       console.error("Apple redirect error:", err);
//       router.push("/auth/login?error=redirect_failed");
//     }
//   }, [dispatch, router]);

//   return <p>Finalizing login...</p>;
// };

// export default AppleRedirect;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const { id_token } = req.body;
  if (!id_token) {
    return res.status(400).json({ error: "Missing id_token" });
  }

  try {
    const backendRes = await fetch(
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

    const data = await backendRes.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("Error verifying Apple login:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
