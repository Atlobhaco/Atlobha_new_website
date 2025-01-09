import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";

function CommunicationSection() {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const socialMedia = [
    {
      src: "/icons/twitter-round.svg",
      onclick: () => {},
    },
    {
      src: "/icons/TikTok.svg",
      onclick: () => {},
    },
    {
      src: "/icons/insta.svg",
      onclick: () => {},
    },
    {
      src: "/icons/Facebook-round.svg",
      onclick: () => {},
    },
  ];
  const StaticLinks = [
    {
      text: t.returnPolicy,
      onClick: () => {
        alert("clicked");
      },
    },
    {
      text: t.privacyPolicy,
      onClick: () => {},
    },
    {
      text: t.termsCondition,
      onClick: () => {},
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
