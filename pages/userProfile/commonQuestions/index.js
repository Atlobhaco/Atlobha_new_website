import BreadCrumb from "@/components/BreadCrumb";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
import Questions from "@/components/userProfile/commonQuestions";

const UserProfile = dynamic(() => import(".."), {
  ssr: false, // disable SSR if the component uses browser APIs (window, document, etc.)
  loading: () => <p></p>, // optional fallback UI
});

function CommonQuestions() {
  const router = useRouter();
  const { isMobile } = useScreenSize();
  const { mobileScreen, customScreens } = router.query;

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

          <Questions />
        </div>{" "}
      </div>{" "}
    </div>
  );
}

export default CommonQuestions;
