import React, { useState } from "react";
import dynamic from "next/dynamic";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import BreadCrumb from "@/components/BreadCrumb";
import Image from "next/image";
import { Box, Divider, Typography } from "@mui/material";
import useLocalization from "@/config/hooks/useLocalization";
import SharedBtn from "@/components/shared/SharedBtn";
import VoucherCode from "@/components/spareParts/VoucherCode";
import { useRouter } from "next/router";

const UserProfile = dynamic(() => import(".."), {
  ssr: false, // disable SSR if the component uses browser APIs (window, document, etc.)
  loading: () => <p>...</p>, // optional fallback UI
});

function Gift() {
  const router = useRouter();
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const [canAddVoucher, setCanAddVoucher] = useState(false);
  const [inputValVoucher, setInputValVoucher] = useState(false);

  const DividerSec = () =>
    isMobile ? (
      <Divider
        sx={{
          background: "#EAECF0",
          mb: 2,
          my: 1,
          height: 3,
          borderBottomWidth: 0,
        }}
      />
    ) : null;

  return (
    <div className="container-fluid">
      <div className="row">
        {!isMobile && (
          <div className="col-md-4">
            <UserProfile />
          </div>
        )}
        <div className="col-md-8 col-12 pt-4">
          <div className="row mb-2">
            <BreadCrumb />
          </div>
          <div className="row mb-3 mt-3">
            <div className="col-md-6 col-12">
              <Image
                src="/imgs/main-gift-2.svg"
                alt="main-gift"
                width={280}
                height={260}
                style={{
                  width: "100%",
                  height: "100%",
                  maxHeight: "450px",
                }}
              />
            </div>
            {DividerSec()}
            <div className="col-md-6 col-12 d-flex flex-column justify-content-center">
              <Typography
                component={`${isMobile ? "h6" : "h4"}`}
                variant={`${isMobile ? "h6" : "h4"}`}
                sx={{ fontWeight: "700" }}
              >
                {t.oneCardIsEnough}
              </Typography>
              <Typography
                sx={{
                  fontWeight: "400",
                  mt: isMobile ? 1 : 2,
                  color: "#374151",
                  fontSize: `${isMobile ? "12px" : "20px"}`,
                }}
              >
                {t.voucherAtlobhaForAll}
              </Typography>
              <SharedBtn
                text="buyVoucher"
                className="big-main-btn"
                customClass={`w-100 ${isMobile ? "mt-2" : "mt-5"}`}
                onClick={() => router.push("/userProfile/gift/chooseGift")}
              />
            </div>
            {DividerSec()}
            <div className={`col-12  ${isMobile ? "" : "mt-5"}`}>
              <Typography
                component={`${isMobile ? "h6" : "h4"}`}
                variant={`${isMobile ? "h6" : "h4"}`}
                sx={{ fontWeight: "700" }}
              >
                {t.replaceVoucher}
              </Typography>
              <Typography
                sx={{
                  fontWeight: "400",
                  mt: isMobile ? 1 : 2,
                  color: "#374151",
                  fontSize: `${isMobile ? "12px" : "20px"}`,
                }}
              >
                {t.availablePurchase}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <VoucherCode
                  canAddVoucher={canAddVoucher}
                  setCanAddVoucher={setCanAddVoucher}
                  inputValVoucher={inputValVoucher}
                  setInputValVoucher={setInputValVoucher}
                />
              </Box>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gift;
