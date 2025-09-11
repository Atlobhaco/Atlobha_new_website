import useScreenSize from "@/constants/screenSize/useScreenSize";
import Image from "next/image";
import React from "react";

function SponserAds({ sectionInfo }) {
  const { isMobile } = useScreenSize();
  return (
    <Image
      src={sectionInfo?.sponsored_ad?.media || "/imgs/no-img-holder.svg"} // fallback in case media is undefined
      alt="banner-image-sponser"
      width={800}
      height={400}
      style={{
        borderRadius: "20px",
        width: isMobile ? "100%" : "auto",
        maxWidth: "100%",
        display: "block",
        margin: "auto",
        maxHeight: isMobile ? "120px" : "400px",
        minHeight: isMobile ? "120px" : "400px",
      }}
      onError={(e) => (e.target.srcset = "/imgs/no-img-holder.svg")} // Fallback to default image
    />
  );
}

export default SponserAds;
