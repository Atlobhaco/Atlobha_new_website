import { checkApplePayAvailability } from "@/constants/helpers";
import { Box } from "@mui/material";
import React from "react";
import SharedBtn from "../shared/SharedBtn";
import Image from "next/image";
import useScreenSize from "@/constants/screenSize/useScreenSize";

function SocialLogins() {
  const { isMobile } = useScreenSize();

  const generateNonce = (length = 20) => {
    let text = "";
    let possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };
  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/callback`;
    const scope = "openid profile email";
    const responseType = "id_token";

    const nonce = generateNonce(20);
    sessionStorage.setItem("nonce", nonce);

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${encodeURIComponent(
      scope
    )}&nonce=${nonce}`;
    localStorage.setItem("urlRedirectAfterSuccess", window.location?.href);
    window.location.href = googleAuthUrl;
  };

  const handleAppleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/appleCallback`;
    const scope = "name email";
    const responseType = "id_token code"; // Apple requires both
    const responseMode = "form_post"; // ✅ form_post is required when requesting name/email

    const nonce = generateNonce(20);
    sessionStorage.setItem("apple_nonce", nonce);

    const authUrl = `https://appleid.apple.com/auth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=${encodeURIComponent(
      responseType
    )}&response_mode=${responseMode}&scope=${encodeURIComponent(
      scope
    )}&nonce=${nonce}`;

    localStorage.setItem("urlRedirectAfterSuccess", window.location?.href);
    window.location.href = authUrl;
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        {(checkApplePayAvailability() || true) && (
          <SharedBtn
            text="appleLogin"
            className="grey-btn"
            customClass="w-100"
            onClick={handleAppleLogin}
            compBeforeText={
              <Image
                src="/icons/apple-sm.svg"
                alt="logo"
                width={isMobile ? 17 : 20}
                height={isMobile ? 17 : 20}
                style={{ marginBottom: "5px" }}
              />
            }
          />
        )}
      </Box>
      <Box sx={{ mb: 3 }}>
        <SharedBtn
          text="googleLogin"
          className="grey-btn"
          customClass="w-100"
          onClick={handleGoogleLogin}
          compBeforeText={
            <Image
              src="/icons/google-sm.svg"
              alt="logo"
              width={isMobile ? 17 : 20}
              height={isMobile ? 17 : 20}
              style={{ marginBottom: "4px" }}
            />
          }
        />
      </Box>
    </>
  );
}

export default SocialLogins;
