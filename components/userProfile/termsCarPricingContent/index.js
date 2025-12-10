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
          {t.termsCondition}
        </Box>
        <Box
          sx={{
            padding: "0px 16px",
            color: "#374151",
            fontSize: "14px",
          }}
        >
          {t.atlobhaOfferTerms}
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
          1. {t.requestProcess.header}
        </Box>{" "}
        <ul>
          <li style={{ marginBottom: "7px" }}>{t.requestProcess.step1}</li>
          <li style={{ marginBottom: "7px" }}>{t.requestProcess.step2}</li>
          <li style={{ marginBottom: "7px" }}>{t.requestProcess.step3}</li>
          <li style={{ marginBottom: "7px" }}>{t.requestProcess.step4}</li>
        </ul>
      </Box>
      {/* step 2 */}
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
          2. {t.validityPeriod.header}
        </Box>{" "}
        <ul>
          <li style={{ marginBottom: "7px" }}>{t.validityPeriod.step1}</li>
          <li style={{ marginBottom: "7px" }}>{t.validityPeriod.step2}</li>
        </ul>
      </Box>
      {/* step 3 */}
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
          3. {t.reservationDeposit.header}
        </Box>{" "}
        <ul>
          <li style={{ marginBottom: "7px" }}>{t.reservationDeposit.step1}</li>
          <li style={{ marginBottom: "7px" }}>{t.reservationDeposit.step2}</li>
        </ul>
      </Box>
      {/* step 4 */}
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
          4. {t.refundPolicy.header}
        </Box>{" "}
        <ul>
          <li style={{ marginBottom: "7px" }}>{t.refundPolicy.step1}</li>
        </ul>
      </Box>
    </div>
  );
}

export default TermsCarPricingContent;
