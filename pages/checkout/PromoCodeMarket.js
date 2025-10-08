import DialogCentered from "@/components/DialogCentered";
import SharedBtn from "@/components/shared/SharedBtn";
import PromoCodeSpare from "@/components/spareParts/PromoCodeSpare";
import VoucherCode from "@/components/spareParts/VoucherCode";
import useLocalization from "@/config/hooks/useLocalization";
import { riyalImgBlack, riyalImgOrange } from "@/constants/helpers";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import {
  setPromoCodeForSpareParts,
  setVoucher,
} from "@/redux/reducers/addSparePartsReducer";
import { Box } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function PromoCodeMarket({ promoCodeId, setPromoCodeId, query }) {
  const { t, locale } = useLocalization();
  const dispatch = useDispatch();
  const { isMobile } = useScreenSize();
  const [openAddCoupon, setOpenAddCoupon] = useState(false);
  const [openAddVoucher, setOpenAddVoucher] = useState(false);
  const { promoCode, voucherCode, allPromoCodeData } = useSelector(
    (state) => state.addSpareParts
  );
  const [canAddVoucher, setCanAddVoucher] = useState(false);
  const [inputValVoucher, setInputValVoucher] = useState(false);

  const textPromoStyle = {
    color: "#232323",
    fontSize: isMobile ? "14px" : "15px",
    fontWeight: "500",
  };

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
            {/* <Box
              sx={{
                mx: 2,
                color: "#EB3C24",
                fontWeight: "500",
                cursor: "pointer",
              }}
              onClick={() => {
                dispatch(setVoucher({ data: null }));
              }}
            >
              Delete
            </Box> */}
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
              />
            </Box>
            {/* <Box
              sx={{
                display: "flex",
                gap: "10px",
                borderTop: !isMobile && "1px solid rgba(24, 24, 27, 0.06)",
                width: "100%",
                justifyContent: "flex-end",
                pt: !isMobile && 3,
              }}
            >
              <SharedBtn
                type="submit"
                text="common.add"
                className="big-main-btn"
                customClass={`${isMobile ? "w-50" : "w-25"}`}
                onClick={() => {
                  setOpenAddCoupon(false);
                }}
                disabled={!promoCodeId}
              />

              <SharedBtn
                text="common.cancel"
                className="outline-btn"
                customClass={`${isMobile ? "w-50" : "w-25"}`}
                onClick={() => {
                  setOpenAddCoupon(false);
                  setPromoCodeId(null);
                  dispatch(setPromoCodeForSpareParts({ data: null }));
                }}
              />
            </Box> */}
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
            {/* <Box
              sx={{
                display: "flex",
                gap: "10px",
                borderTop: !isMobile && "1px solid rgba(24, 24, 27, 0.06)",
                width: "100%",
                justifyContent: "flex-end",
                pt: !isMobile && 3,
              }}
            >
              <SharedBtn
                type="submit"
                text="common.add"
                className="big-main-btn"
                customClass={`${isMobile ? "w-50" : "w-25"}`}
                onClick={() => {
                  if (canAddVoucher) {
                    dispatch(setVoucher({ data: canAddVoucher }));
                  }
                  setInputValVoucher(null);
                  setOpenAddVoucher(false);
                }}
                disabled={!canAddVoucher}
              />

              <SharedBtn
                text="common.cancel"
                className="outline-btn"
                customClass={`${isMobile ? "w-50" : "w-25"}`}
                onClick={() => {
                  dispatch(setVoucher({ data: null }));
                  setOpenAddVoucher(false);
                  setOpenAddVoucher(false);
                  setInputValVoucher(null);
                }}
              /> 
            </Box> */}
          </>
        }
      />
    </Box>
  );
}

export default PromoCodeMarket;
