import SharedBtn from "@/components/shared/SharedBtn";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

function NotransactionsHappen({ handleOpenAddVoucher }) {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        padding: "20px",
      }}
    >
      <Image
        src="/imgs/no-trans.svg"
        alt="no-taransaction"
        width={isMobile ? 122 : 200}
        height={isMobile ? 100 : 150}
      />
      <Typography
        sx={{
          fontWeight: "500",
          fontSize: isMobile ? "20px" : "26px",
        }}
      >
        {t.noTransactions}
      </Typography>
      <Typography
        sx={{
          fontWeight: "400",
          fontSize: isMobile ? "12px" : "18px",
        }}
      >
        {t.canAddBalance}
      </Typography>
      <SharedBtn
        onClick={() => handleOpenAddVoucher()}
        text="addBalance"
        className="big-main-btn"
      />
    </Box>
  );
}

export default NotransactionsHappen;
