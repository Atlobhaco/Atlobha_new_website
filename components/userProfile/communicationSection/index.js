import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

function CommunicationSection() {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const router = useRouter();

  const socialMedia = [
    {
      src: "/icons/twitter-round.svg",
      onclick: () => {
        window.open("https://twitter.com/Atlobha_ksa", "noopener,noreferrer");
      },
    },
    {
      src: "/icons/TikTok.svg",
      onclick: () => {
        window.open(
          "http://www.tiktok.com/@atlobha_ksa",
          "noopener,noreferrer"
        );
      },
    },
    {
      src: "/icons/insta.svg",
      onclick: () => {
        window.open(
          "https://www.instagram.com/Atlobha_ksa",
          "noopener,noreferrer"
        );
      },
    },
    {
      src: "/icons/social/Snapchat-lg.svg",
      onclick: () => {
        window.open(
          "https://www.snapchat.com/add/Atlobha_ksa",
          "noopener,noreferrer"
        );
      },
    },
  ];
  const StaticLinks = [
    {
      text: t.returnPolicy,
      onClick: () => {
        router.push("/userProfile/returnPolicy");
      },
    },
    {
      text: t.privacyPolicy,
      onClick: () => {
        router.push("/userProfile/privacyPolicy");
      },
    },
    {
      text: t.termsCondition,
      onClick: () => {
        router.push("/userProfile/termsCondition");
      },
    },
  ];
  return (
    <Box>
      <Box
        sx={{
          padding: "10px 0px",
          color: "#429DF8",
          fontSize: isMobile ? "13px" : "16px",
          fontWeight: "700",
          borderBottom: "1px solid #F0F0F0",
        }}
        className="col-md-12"
      >
        {t.communicate}
      </Box>

      <Box
        sx={{
          padding: "24px 0px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            cursor: "pointer",
          }}
        >
          {socialMedia?.map((social) => (
            <Image
              loading="lazy"
              onClick={social?.onclick}
              key={social?.src}
              alt={social?.src}
              src={social?.src}
              width={isMobile ? 28 : 38}
              height={isMobile ? 28 : 38}
            />
          ))}
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            cursor: "pointer",
            mt: 3,
            textDecoration: "underline",
            fontWeight: "500",
            fontSize: isMobile ? "10px" : "14px",
            textAlign: "center",
          }}
        >
          {StaticLinks?.map((link) => (
            <Box
              sx={{
                "&:hover": {
                  color: "#429DF8",
                },
              }}
              onClick={link?.onClick}
              key={link?.text}
            >
              {link?.text}
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          mt: 2,
          color: "#6B7280",
          fontSize: "10px",
          textAlign: "center",
          fontWeight: "500",
        }}
      >
        {t.version} (565) v2.23
      </Box>

      <Box
        sx={{
          mt: 2,
          color: "#374151",
          fontSize: "12px",
          textAlign: "center",
          fontWeight: "500",
          mb: 4,
        }}
      >
        {t.atlobhaCopyright}
      </Box>
    </Box>
  );
}

export default CommunicationSection;
