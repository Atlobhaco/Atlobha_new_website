import AddsparePart from "@/components/spareParts/AddSparePart";
import ColoredHint from "@/components/ColoredHint";
import MetaTags from "@/components/shared/MetaTags";
import PaymentMethodSpare from "@/components/spareParts/PaymentMethodSpare";
import PromoCodeSpare from "@/components/spareParts/PromoCodeSpare";
import SharedTextArea from "@/components/shared/SharedTextArea";
import { Box } from "@mui/material";
import React, { useState } from "react";
import DialogCentered from "@/components/DialogCentered";
import DialogLeftRight from "@/components/DialogLeftRight";
import DialogMultiDirection from "@/components/DialogMultiDirection";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import Image from "next/image";
import HowMakePrice from "@/components/spareParts/HowMakePrice";
import SharedBtn from "@/components/shared/SharedBtn";
import AvailablePaymentMethodsImgs from "@/components/spareParts/AvailablePaymentMethodsImgs";
import PartsImages from "@/components/spareParts/PartsImages";

const style = {
  marginTop: "32px",
};


function SpareParts() {
  const { isMobile } = useScreenSize();
  const [openHowPricing, setOpenhowPricing] = useState(false);

  return (
    <Box>
      <MetaTags title="تسعير قطع الغيار" content="تسعير قطع الغيار" />
      <div className="container pb-5 mb-5">
        <div className="row" style={style}>
          <div className="col-12">
            <ColoredHint
              bgColor="#FEFCED"
              header="كيف تتم عملية التسعير؟"
              subHeader="اكتشف كيف تتم عملية التسعير في اطلبها لنساعدك بأفضل طريقة"
              iconPath="/icons/money.svg"
              onClick={() => setOpenhowPricing(true)}
            />
          </div>
        </div>
        {/* <div className="row">
          <div className="col-md-8 col-12 mt-4">
            <AddsparePart />
            <div className="mt-4">
              <PromoCodeSpare />
            </div>
            <div className="mt-4">
              <SharedTextArea />
            </div>
          </div>
          <div className="col-md-4 col-12 mt-4">
            <PaymentMethodSpare />
            {!isMobile && (
              <Box sx={{ margin: "30px 0px" }}>
                <SharedBtn
                  className="big-main-btn"
                  customClass="w-100"
                  text="makeSpare"
                />
              </Box>
            )}
            {!isMobile && <AvailablePaymentMethodsImgs />}
          </div>
        </div>
        <div
          className="row"
          style={{
            marginTop: "48px",
          }}
        >
          <div className="col-12 text-center">
            <PartsImages />
            {isMobile && (
              <Box sx={{ marginTop: "30px" }}>
                <SharedBtn
                  disabled={true}
                  className="big-main-btn"
                  customClass="w-100"
                  text="makeSpare"
                />
              </Box>
            )}
          </div>
        </div> */}
      </div>

      {/* popup for how to make price */}
      <DialogCentered
        showTitle={null}
        open={openHowPricing}
        setOpen={setOpenhowPricing}
        hasCloseIcon
        customClass={!isMobile ? "sm-popup-width" : ""}
        content={<HowMakePrice setOpenhowPricing={setOpenhowPricing} />}
      />
    </Box>
  );
}

export default SpareParts;
