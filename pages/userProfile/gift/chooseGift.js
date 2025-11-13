import React, { useState } from "react";
import dynamic from "next/dynamic";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import BreadCrumb from "@/components/BreadCrumb";
import { Divider } from "@mui/material";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { VOUCHER_TEMPLATES } from "@/config/endPoints/endPoints";
import * as Yup from "yup";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import BuyGift from "@/components/userProfile/gift/buygift";
import EnterInfoGift from "@/components/userProfile/gift/enterInfoGift";

const UserProfile = dynamic(() => import(".."), {
  ssr: false, // disable SSR if the component uses browser APIs (window, document, etc.)
  loading: () => <p>...</p>, // optional fallback UI
});

function ChooseGift() {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const [steps, setSteps] = useState(1);
  const [selectedGift, setSelectedgift] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState({
    price: null,
    selectFromDefined: false,
  });
  const [userDataForBuying, setUserDataForBuying] = useState(null);

  const { isFetching, data: giftCards } = useCustomQuery({
    name: "vouchers",
    url: `${VOUCHER_TEMPLATES}`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    onSuccess: (res) => {
      if (res?.id) {
        setSelectedgift(res?.images[0]);
        setSelectedPrice({
          selectFromDefined: true,
          price: res?.prices?.sort((a, b) => Number(a) - Number(b))[0],
        });
      }
    },
    enabled: true,
  });

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    comment: "",
  };

  const validatePhoneNumber = (phone, countryCode) => {
    if (phone?.trim()?.length > 4) {
      const phoneNumber = parsePhoneNumberFromString(phone, countryCode);
      return phoneNumber && phoneNumber.isValid();
    } else {
      return true;
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t.required).min(4, t.minLength4),
    email: Yup.string()
      .nullable()
      .notRequired()
      .email(t.invalidEmail)
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        t.invalidEmail
      ),
    phone: Yup.string()
      .required(t.required)
      .test("is-valid-phone", t.invalid_phone, function (value) {
        const { country } = this.parent;

        if (!value) return false; // empty value is invalid

        // Remove country code if present
        const normalizedValue = value.replace(`+966`, "").trim();

        // If nothing is left after removing country code, it's invalid
        if (!normalizedValue) return false;

        // validatePhoneNumber should now check the full number including remaining digits
        return validatePhoneNumber(value, country);
      }),
    comment: Yup.string().notRequired(),
  });

  const handlePhoneInputChange = (e, setFieldValue) => {
    if (!e?.target?.value.startsWith("+966")) {
      setFieldValue("phone", `+966`);
    } else {
      setFieldValue("phone", e?.target?.value);
    }
  };

  const handleSubmit = (values) => {
    setUserDataForBuying(values);
    setSteps(2);
  };

  const DividerSec = () =>
    isMobile ? (
      <Divider
        sx={{
          background: "#EAECF0",
          my: 1,
          mb: 3,
          mt: 3,
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
            {/* {steps === 2 && (
              <div className="d-flex justify-content-end">
                <Image
                  onClick={() => setSteps(1)}
                  loading="lazy"
                  src="/icons/arrow-left.svg"
                  alt="alert"
                  width={24}
                  height={24}
                  className="cursor-pointer"
                />
              </div>
            )} */}
          </div>
          {steps === 1 ? (
            <EnterInfoGift
              isFetching={isFetching}
              selectedGift={selectedGift}
              giftCards={giftCards}
              setSelectedgift={setSelectedgift}
              DividerSec={DividerSec}
              setSelectedPrice={setSelectedPrice}
              selectedPrice={selectedPrice}
              initialValues={initialValues}
              validationSchema={validationSchema}
              handleSubmit={handleSubmit}
              handlePhoneInputChange={handlePhoneInputChange}
            />
          ) : (
            <BuyGift
              selectedGift={selectedGift}
              selectedPrice={selectedPrice}
              userDataForBuying={userDataForBuying}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ChooseGift;
