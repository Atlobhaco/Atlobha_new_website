import SharedBtn from "@/components/shared/SharedBtn";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

function NoCarAdded({ hideBtn = false }) {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "cente",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        gap: "15px",
      }}
    >
      <Image src="/imgs/empty-car.svg" alt="empty" width={130} height={118} />
      <Box
        sx={{
          color: "#1C1C28",
          fontSize: "20px",
          fontWeight: "500",
          textAlign: "center",
        }}
      >
        {t.noCarFound}
        <Box
          sx={{
            fontSize: "12px",
            fontWeight: "400",
          }}
        >
          {t.addOwnCar}
        </Box>
      </Box>
      {!hideBtn && (
        <Box>
          <SharedBtn
            onClick={() => {
              router.push("/userProfile/myCars/addNewCar");
            }}
            className="big-main-btn"
            text="addNewCar"
            customStyle={{
              width: isMobile ? "80vw" : "400px",
            }}
          />
        </Box>
      )}
    </Box>
  );
}

export default NoCarAdded;
