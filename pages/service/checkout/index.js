import ComingSoon from "@/components/comingSoon";
import { useRouter } from "next/router";
import React from "react";

function CheckoutService() {
  const { query } = useRouter();

  return (
    <div>
      {/* <pre>{JSON.stringify(decodeURIComponent(query.serviceDetails))}</pre> */}
      <ComingSoon />
    </div>
  );
}

export default CheckoutService;
