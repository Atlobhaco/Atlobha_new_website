import AtlobhaPlusHint from "@/components/userProfile/atlobhaPlusHint";
import useLocalization from "@/config/hooks/useLocalization";
import Image from "next/image";
import React, { useState } from "react";
import style from "../carPricing.module.scss";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import AddAvailablePayMethods from "@/components/userProfile/orderDetails/addAvailablePayMethods";
import { useDispatch, useSelector } from "react-redux";
import { usersAddressesQuery } from "@/config/network/Shared/GetDataHelper";
import {
  setAllAddresses,
  setDefaultAddress,
} from "@/redux/reducers/selectedAddressReducer";
import { useAuth } from "@/config/providers/AuthProvider";
import PromoCodeMarket from "@/pages/checkout/PromoCodeMarket";
import DialogCentered from "@/components/DialogCentered";
import Questions from "@/components/userProfile/commonQuestions";
import { Box } from "@mui/material";

function CarPricingCheckoutData({ promoCodeId, setPromoCodeId, carPricing }) {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();
  const [openCommonQuestions, setOpenCommonnquestions] = useState(false);

  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );
  const userAddress = selectedAddress?.id ? selectedAddress : defaultAddress;

  usersAddressesQuery({
    setAllAddresses,
    user,
    dispatch,
    setDefaultAddress,
  });

  return (
    <>
      <div className={`${style["border-bottom"]} py-4 pt-0`}>
        <AtlobhaPlusHint
          alwaysHorizontalDesgin={true}
          title={t.wantRepriceForCar}
          subtitle={t.someAnswers}
          btnText="commonQuestions"
          btnOnClick={() => setOpenCommonnquestions(true)}
        />
      </div>
      {/* car details for pricing */}
      <div
        className={`${style["border-bottom"]} py-4 d-flex align-items-center gap-2`}
      >
        <Image
          src="/icons/car-active.svg"
          alt="car"
          width={isMobile ? 20 : 23}
          height={isMobile ? 20 : 23}
        />
        <div>
          <div className={`${style["headers-checkout"]}`}>
            {t.CarForPricing}
          </div>
          <div className="d-flex align-items-center gap-3">
            <Image
              src={carPricing?.brand?.image}
              alt="car-image"
              width={isMobile ? 30 : 40}
              height={isMobile ? 30 : 40}
            />
            <div className="d-flex flex-column">
              <div className={`${style["car-info"]}`}>
                {locale === "ar"
                  ? carPricing?.brand?.name_ar
                  : carPricing?.brand?.name_en}{" "}
              </div>
              <div className={`${style["car-info"]}`}>
                {locale === "ar"
                  ? carPricing?.model?.name_ar
                  : carPricing?.model?.name_en}
              </div>
            </div>
            <div className={`${style["car-info"]}`}>{carPricing?.year}</div>
          </div>
        </div>
      </div>
      {/* prefered purchase method */}
      <div
        className={`${style["border-bottom"]} py-4 d-flex align-items-center gap-2`}
      >
        <Image
          src="/icons/yellow-card.svg"
          alt="car"
          width={isMobile ? 20 : 23}
          height={isMobile ? 20 : 23}
        />
        <div>
          <div className={`${style["headers-checkout"]}`}>
            {t.preferedPurchaseMethod}
          </div>
          <div className={`${style["car-info"]}`}>
            {carPricing?.purchase?.type === "CASH"
              ? t.cash
              : t.payMethods.INSTALLMENT}
          </div>
        </div>
      </div>

      {/* available payment methods */}
      <div className={`${style["border-bottom"]} py-4  px-0`}>
        <AddAvailablePayMethods
          orderDetails={{
            address: userAddress,
            status: "new",
          }}
          noPadding={true}
        />
      </div>

      {/* promo and voucher code */}
      <div className={`${style["border-bottom"]} py-4  px-0`}>
        <PromoCodeMarket
          promoCodeId={promoCodeId}
          setPromoCodeId={setPromoCodeId}
          query={{
            brand_id: carPricing?.brand?.id,
            model_id: carPricing?.model?.id,
            year: carPricing?.year,
            order_type: "vehicle-pricing-order",
          }}
          noPadding={true}
        />
      </div>

      {/* popup for common questions */}
      <DialogCentered
        showTitle={true}
        title={t.commonQuestions}
        open={openCommonQuestions}
        setOpen={setOpenCommonnquestions}
        hasCloseIcon
        content={
          <Box
            sx={{
              maxHeight: "70vh",
              overflow: "hidden auto",
            }}
          >
            <Questions />
          </Box>
        }
      />
    </>
  );
}

export default CarPricingCheckoutData;
