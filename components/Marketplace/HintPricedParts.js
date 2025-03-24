import React from "react";
import ColoredHint from "../ColoredHint";
import useLocalization from "@/config/hooks/useLocalization";
import { useRouter } from "next/router";
import { isAuth } from "@/config/hooks/isAuth";

function HintPricedParts({ sectionInfo }) {
  const router = useRouter();
  const { t } = useLocalization();

  if (
    !sectionInfo?.is_active ||
    (sectionInfo?.requires_authentication && !isAuth())
  )
    return null;

  return (
    <ColoredHint
      header={t.havePricedOrder}
      subHeader={t.confirmItNow}
      onClick={() => router.push("/userProfile/myOrders")}
    />
  );
}

export default HintPricedParts;
