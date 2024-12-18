import SharedBtn from "@/components/shared/SharedBtn";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

function NoAddressAdded() {
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
      <Image
        src="/imgs/empty-address.svg"
        alt="empty"
        width={130}
        height={118}
      />
      <Box
        sx={{
          color: "#1C1C28",
          fontSize: "20px",
          fontWeight: "500",
          textAlign: "center",
        }}
      >
        {t.noAddressAdded}
        <Box
          sx={{
            fontSize: "12px",
            fontWeight: "400",
          }}
        >
          {t.addOwnAddress}
        </Box>
      </Box>
      <Box>
        <SharedBtn
          onClick={() => {
            router.push("/userProfile/myAddresses/addNewAddressProfile");
          }}
          className="big-main-btn"
          text="addNewAddress"
          customStyle={{
            width: isMobile ? "80vw" : "400px",
          }}
        />
      </Box>
    </Box>
  );
}

export default NoAddressAdded;
