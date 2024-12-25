import useLocalization from "@/config/hooks/useLocalization";
import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";

function AvailablePaymentMethodsImgs() {
  const { t } = useLocalization();
  
  return (
    <Box>
      <Box
        sx={{
          textAlign: "center",
          color: "#6B7280",
          fontSize: "20px",
          fontWeight: "700",
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
        <Image src={"/imgs/stc.svg"} alt="stc" width={63} height={20} />
        <Image src={"/imgs/tabby.svg"} alt="tabby" width={57} height={20} />
        <Image
          src={"/imgs/apple-pay.svg"}
          alt="apple-pay"
          width={58}
          height={20}
        />
        <Image src={"/imgs/mada.svg"} alt="mada" width={59} height={20} />
        <Image src={"/imgs/visa.svg"} alt="visa" width={58} height={20} />
        <Image src={"/imgs/master.svg"} alt="master" width={39} height={20} />
      </Box>
    </Box>
  );
}

export default AvailablePaymentMethodsImgs;
