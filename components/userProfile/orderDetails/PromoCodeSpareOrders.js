import DialogCentered from "@/components/DialogCentered";
import SharedBtn from "@/components/shared/SharedBtn";
import PromoCodeSpare from "@/components/spareParts/PromoCodeSpare";
import VoucherCode from "@/components/spareParts/VoucherCode";
import { ORDERS, PROMO_CODE, SPARE_PARTS } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function PromocodeSpareOrders({ promoCodeId, setPromoCodeId, query, idOrder }) {
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();
  const [openAddCoupon, setOpenAddCoupon] = useState(false);
  const [openAddVoucher, setOpenAddVoucher] = useState(false);
  const { voucherCode, allPromoCodeData, usePromoThenDeleteit } = useSelector(
    (state) => state.addSpareParts
  );
  const [canAddVoucher, setCanAddVoucher] = useState(false);
  const [inputValVoucher, setInputValVoucher] = useState(false);

  const textPromoStyle = {
    color: "#232323",
    fontSize: isMobile ? "14px" : "15px",
    fontWeight: "500",
  };

  const {
    data,
    isFetching: orderDetailsFetching,
    refetch: refetchAddPromo,
  } = useCustomQuery({
    name: ["savePromoToOrder"],
    url: `${SPARE_PARTS}${ORDERS}/${idOrder}${PROMO_CODE}`,
    refetchOnWindowFocus: false,
    method: "patch",
    body: {
      promo_code_id: allPromoCodeData?.id,
    },
    enabled: false,
    select: (res) => res?.data?.data,
    onSuccess: () => {},
    onError: (err) => {
      toast.error(t.someThingWrong);
    },
  });

  const { data: da } = useCustomQuery({
    name: ["deletePromoToOrder", allPromoCodeData],
    url: `${SPARE_PARTS}${ORDERS}/${idOrder}${PROMO_CODE}`,
    refetchOnWindowFocus: false,
    method: "delete",
    body: {
      promo_code_id: allPromoCodeData?.id,
    },
    enabled: usePromoThenDeleteit ? true : false,
    select: (res) => res?.data?.data,
    onSuccess: () => {},
    onError: (err) => {
      toast.error(t.someThingWrong);
    },
  });

  return (
    <Box sx={{ padding: "16px 13px" }}>
      <Box
        sx={{
          color: "#232323",
          fontSize: isMobile ? "14px" : "18px",
          fontWeight: "700",
        }}
      >
        <Image
          loading="lazy"
          alt="yellow-promo"
          src={`/icons/promo-yellow.svg`}
          width={isMobile ? 25 : 30}
          height={isMobile ? 25 : 30}
          className={`${locale === "ar" ? "ms-2" : "me-2"}`}
        />
        {t.couponVoucher}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 3,
          borderBottom: "1px solid #E6E6E6",
          //   background: "red",
        }}
      >
        {allPromoCodeData ? (
          <Box className="w-100">
            <PromoCodeSpare
              promoCodeId={promoCodeId}
              setPromoCodeId={setPromoCodeId}
              customTitle={t.couponDiscount}
              query={query}
              refetchAddPromo={refetchAddPromo}
            />
          </Box>
        ) : (
          <>
            <Box sx={textPromoStyle}>{t.couponDiscount}</Box>
            <Box>
              <SharedBtn
                text="AddCoupon"
                className="outline-btn"
                onClick={() => setOpenAddCoupon(true)}
                customStyle={{
                  minWidth: isMobile
                    ? "140px"
                    : locale === "en"
                    ? "220px"
                    : "180px",
                }}
              />
            </Box>
          </>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 3,
        }}
      >
        {voucherCode?.amount ? (
          <Box className="w-100">
            <VoucherCode
              setCanAddVoucher={setCanAddVoucher}
              canAddVoucher={canAddVoucher}
              setInputValVoucher={setInputValVoucher}
              inputValVoucher={inputValVoucher}
            />
          </Box>
        ) : (
          <>
            <Box sx={textPromoStyle}>{t.giftVoucher}</Box>
            <Box>
              {/* اضف كوبون الخصم */}
              <SharedBtn
                text="addGiftVoucher"
                className="outline-btn"
                onClick={() => setOpenAddVoucher(true)}
                customStyle={{
                  minWidth: isMobile
                    ? "140px"
                    : locale === "en"
                    ? "220px"
                    : "180px",
                }}
              />
            </Box>
          </>
        )}
      </Box>
      <DialogCentered
        hasCloseIcon={true}
        open={openAddCoupon}
        setOpen={setOpenAddCoupon}
        subtitle={false}
        title={t.couponDiscount}
        content={
          <>
            <Box
              sx={{
                textAlign: isMobile ? "start" : "center",
                fontSize: isMobile ? "15px" : "20px",
                fontWeight: "400",
                color: "#0F172A",
                mt: isMobile ? 2 : 4,
                mb: 1,
                mx: 2,
              }}
            >
              {t.availablePurchase}{" "}
            </Box>
            <Box sx={{ mb: 3 }}>
              <PromoCodeSpare
                promoCodeId={promoCodeId}
                setPromoCodeId={setPromoCodeId}
                customTitle={t.couponDiscount}
                query={query}
                refetchAddPromo={refetchAddPromo}
              />
            </Box>
          </>
        }
      />

      {/* voucher dialog */}
      <DialogCentered
        hasCloseIcon={true}
        open={openAddVoucher}
        setOpen={setOpenAddVoucher}
        subtitle={false}
        title={t.addBalanceToWallet}
        content={
          <>
            <Box
              sx={{
                textAlign: isMobile ? "start" : "center",
                fontSize: isMobile ? "15px" : "20px",
                fontWeight: "400",
                color: "#0F172A",
                mt: isMobile ? 2 : 4,
                mb: 1,
                mx: 2,
              }}
            >
              {t.availablePurchase}
              <br />
              {t.justUseVoucher}
            </Box>
            <Box sx={{ mb: 3 }}>
              <VoucherCode
                setCanAddVoucher={setCanAddVoucher}
                canAddVoucher={canAddVoucher}
                setInputValVoucher={setInputValVoucher}
                inputValVoucher={inputValVoucher}
              />
            </Box>
          </>
        }
      />
    </Box>
  );
}

export default PromocodeSpareOrders;
