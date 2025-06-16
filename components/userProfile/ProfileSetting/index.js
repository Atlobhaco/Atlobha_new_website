import React from "react";
import style from "./ProfileSettings.module.scss";
import Image from "next/image";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import useScreenSize from "@/constants/screenSize/useScreenSize";

function ProfileSetting({ data }) {
  const router = useRouter();
  const { isMobile } = useScreenSize();

  const svgHolder = {
    svg: {
      fontSize: isMobile ? "20px" : "27px",
      color: router?.pathname === data?.path ? "black" : "#FFD400",
    },
  };

  return (
    <Box
      className={`${style["setting"]} ${
        router?.pathname === data?.path && style["active"]
      }`}
      onClick={data?.onClick && data?.onClick}
    >
      <Box sx={svgHolder}>
        {/* <Image
          src={
            router?.pathname === data?.path ? data?.activeSrc : data?.iconSrc
          }
          alt="icon"
          width={19}
          height={19}
          style={{
            color: "black",
            fill: "black",
            stroke: "black",
          }}
        /> */}
        {data?.iconSrc}
        <span className={`${style["text"]}`}>{data?.text}</span>
      </Box>
      <Box>
        {data?.hint && <span className={`${style["hint"]}`}>{data?.hint}</span>}
        {!data?.hideArrow && (
          <Image
            loading="lazy"
            src="/icons/arrow-left-sm.svg"
            alt="icon"
            width={12}
            height={12}
            className={`${style["arrow"]}`}
          />
        )}
      </Box>
    </Box>
  );
}

export default ProfileSetting;
