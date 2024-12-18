import useLocalization from "@/config/hooks/useLocalization";
import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";

function VinNumIInfo() {
  const { t } = useLocalization();

  const hintText = {
    color: "#1C1C28",
    fontSize: "20px",
    fontWeight: "700",
    textAlign: "center",
    my: 3,
  };
  const instructionsText = {
    color: "#0F172A",
    fontSize: "12px",
    fontWeight: "700",
    display: "flex",
  };

  return (
    <>
      <Box>
        <Image
          src="/imgs/vin-instruction.svg"
          alt="chase-vin"
          width={335}
          height={150}
          style={{
            maxWidth: "100%",
          }}
        />
      </Box>
      <Box sx={hintText}>{t.chaseNumber}</Box>
      <Box sx={instructionsText}>
        <ul>
          <li className="mb-3">{t.vinInstructionOne}</li>
          <li>{t.vinInstructionTwo}</li>
        </ul>
      </Box>
    </>
  );
}

export default VinNumIInfo;
