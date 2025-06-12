// pages/api/appleCallback.js
import cookie from "cookie";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const rawBody = await new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => resolve(body));
      req.on("error", reject);
    });

    const formData = new URLSearchParams(rawBody);
    const id_token = formData.get("id_token");
    const code = formData.get("code");
    const state = formData.get("state");

    if (!id_token) return res.status(400).send("Missing id_token");

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

    if (!data?.data?.user?.id) {
      return res.redirect("/auth/login?error=apple_login_failed");
    }

    // Save user data in cookie temporarily
    const userDataEncoded = encodeURIComponent(JSON.stringify(data));
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("apple_user", userDataEncoded, {
        httpOnly: false, // must be readable on client-side
        path: "/",
        maxAge: 60, // expires in 1 min
      })
    );

    // Redirect to client route that reads cookie and dispatches
    const cookies = cookie.parse(req.headers.cookie || "");
    const redirectUrl = cookies.urlRedirectAfterSuccess || "/";
    return res.redirect(
      `/auth/appleRedirect?redirect=${encodeURIComponent(redirectUrl)}`
    );
  } catch (err) {
    console.error("Apple callback error:", err);
    return res.status(500).send("Internal Server Error");
  }
}
