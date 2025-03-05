import ComingSoon from "@/components/comingSoon";
import MetaTags from "@/components/shared/MetaTags";
import useLocalization from "@/config/hooks/useLocalization";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

function Sections() {
  const { t } = useLocalization();
  const router = useRouter();
  const { secTitle, secType } = router.query;

  useEffect(() => {
    if (secType === "maintenance-reservation") {
      window.webengage.onReady(() => {
        webengage.track("PERIODIC_MAITAINCE_VIEWED", {
          event_status: true,
        });
      });
    }
    if (secType === "najm-and-estimation") {
      window.webengage.onReady(() => {
        webengage.track("TAQDEER_SERVICE_VIEWED", {
          event_status: true,
        });
      });
    }
  }, [secType]);

  return (
    <Box>
      <MetaTags title={secTitle} content={secType} />

      <ComingSoon />
    </Box>
  );
}

export default Sections;
