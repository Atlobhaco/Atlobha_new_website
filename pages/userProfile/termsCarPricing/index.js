import React from "react";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import BreadCrumb from "@/components/BreadCrumb";
import useLocalization from "@/config/hooks/useLocalization";
import { useRouter } from "next/router";
import TermsCarPricingContent from "@/components/userProfile/termsCarPricingContent";
import dynamic from "next/dynamic";

const UserProfile = dynamic(() => import(".."), {
  ssr: false, // disable SSR if the component uses browser APIs (window, document, etc.)
  loading: () => <p>...</p>, // optional fallback UI
});

function TermsCarPricing() {
  const router = useRouter();
  const { mobileScreen, customScreens } = router.query;
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();

  return (
    <div className="container-fluid">
      <div className="row">
        {!isMobile && !mobileScreen && !customScreens && (
          <div className="col-md-4">
            <UserProfile />
          </div>
        )}
        <div className={`${customScreens ? "col-12" : "col-md-8 col-12"} pt-4`}>
          {!mobileScreen && !customScreens && (
            <div className="row">
              <BreadCrumb />
            </div>
          )}

          <TermsCarPricingContent />
        </div>
      </div>
    </div>
  );
}

export default TermsCarPricing;
