import useScreenSize from "@/constants/screenSize/useScreenSize";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

function SponserAds({ sectionInfo }) {
  const { isMobile } = useScreenSize();
  const router = useRouter();

  return (
    <Image
      src={sectionInfo?.sponsored_ad?.media || "/imgs/no-img-holder.svg"} // fallback in case media is undefined
      alt="banner-image-sponser"
      width={800}
      height={400}
      style={{
        borderRadius: "20px",
        width: "100%",
        maxWidth: "100%",
        display: "block",
        margin: "auto",
        maxHeight: isMobile ? "100px" : "350px",
        minHeight: isMobile ? "100px" : "400px",
      }}
      onClick={() => {
        if (sectionInfo?.sponsored_ad?.link) {
          router.push(sectionInfo?.sponsored_ad?.link);
        }
      }}
      onError={(e) => (e.target.srcset = "/imgs/no-img-holder.svg")} // Fallback to default image
    />
  );
}

export default SponserAds;
