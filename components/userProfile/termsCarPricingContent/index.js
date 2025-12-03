import useLocalization from "@/config/hooks/useLocalization";
import { Box } from "@mui/material";
import React from "react";

function TermsCarPricingContent() {
  const { t } = useLocalization();

  return (
    <div className="row mb-4 mt-3">
      <Box
        sx={{
          padding: "15px  4px",
          color: "#374151",
          fontSize: "14px",
        }}
      >
        <Box
          sx={{
            fontSize: "20px",
            fontWeight: "500",
            padding: "0px 16px",
          }}
        >
          {t.entryForTerms}
        </Box>
        <Box
          sx={{
            padding: "0px 16px",
            color: "#374151",
            fontSize: "14px",
          }}
        >
          {t.entryTermsInfo}
        </Box>
      </Box>
      <Box
        sx={{
          padding: "15px  4px",
          color: "#374151",
          fontSize: "14px",
        }}
      >
        <Box
          sx={{
            color: "#1C1C28",
            fontSize: "16px",
            fontWeight: "700",
            padding: "0px 16px",
            mb: 1,
          }}
        >
          {t.firstRule}
        </Box>{" "}
        <ul>
          <li style={{ marginBottom: "7px" }}>{t.oneRule}</li>
          <li style={{ marginBottom: "7px" }}>{t.twoRule}</li>
          <li style={{ marginBottom: "7px" }}>{t.threeRule}</li>
          <li style={{ marginBottom: "7px" }}>{t.fourRule}</li>
        </ul>
      </Box>
    </div>
  );
}

export default TermsCarPricingContent;
