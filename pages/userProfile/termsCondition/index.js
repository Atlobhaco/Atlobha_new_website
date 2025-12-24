import React from "react";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import BreadCrumb from "@/components/BreadCrumb";
import useLocalization from "@/config/hooks/useLocalization";
import { useRouter } from "next/router";
import TermsConditionsData from "@/components/userProfile/termsCondition";
import dynamic from "next/dynamic";

function TermsCondition() {
  const router = useRouter();
  const { mobileScreen, customScreens } = router.query;
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();

  const UserProfile = dynamic(() => import(".."), {
    ssr: false, // disable SSR if the component uses browser APIs (window, document, etc.)
    loading: () => <p>...</p>, // optional fallback UI
  });

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

          <TermsConditionsData />
        </div>
      </div>
    </div>
  );
}

export default TermsCondition;
