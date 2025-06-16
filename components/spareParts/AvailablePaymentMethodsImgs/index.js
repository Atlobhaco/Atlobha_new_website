import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";

function AvailablePaymentMethodsImgs() {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();

  return (
    <Box>
      <Box
        sx={{
          textAlign: "center",
          color: "#6B7280",
          fontSize: isMobile ? "16px" : "20px",
          fontWeight: "700",
          mt: isMobile ? 2 : 0,
        }}
      >
        {t.availablePaymentsMethods}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          flexWrap: "wrap",
          mt: 1,
        }}
      >
        <Image
          loading="lazy"
          src={"/imgs/stc.svg"}
          alt="stc"
          width={isMobile ? 35 : 63}
          height={20}
        />
        <Image
          loading="lazy"
          src={"/imgs/tabby.svg"}
          alt="tabby"
          width={isMobile ? 35 : 57}
          height={20}
        />
        <Image
          loading="lazy"
          src={"/imgs/apple-pay.svg"}
          alt="apple-pay"
          width={isMobile ? 35 : 58}
          height={20}
        />
        <Image
          loading="lazy"
          src={"/imgs/mada.svg"}
          alt="mada"
          width={isMobile ? 35 : 59}
          height={20}
        />
        <Image
          loading="lazy"
          src={"/imgs/visa.svg"}
          alt="visa"
          width={isMobile ? 35 : 58}
          height={20}
        />
        <Image
          loading="lazy"
          src={"/imgs/master.svg"}
          alt="master"
          width={isMobile ? 35 : 39}
          height={20}
        />
      </Box>
    </Box>
  );
}

export default AvailablePaymentMethodsImgs;
