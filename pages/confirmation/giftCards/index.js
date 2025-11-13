import React, { useEffect, useState } from "react";
import style from "../../spareParts/confirmation/confirmation.module.scss";
import useLocalization from "@/config/hooks/useLocalization";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast } from "react-toastify";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import Image from "next/image";
import {
  availablePaymentMethodImages,
  riyalImgBlack,
} from "@/constants/helpers";
import { Box } from "@mui/material";
import SharedBtn from "@/components/shared/SharedBtn";
import { useRouter } from "next/router";
import { decryptAES } from "@/lib/mispay";

function GiftCardsConfirmation() {
  const router = useRouter();
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const [decrypted, setDecrypted] = useState(null);
  const [giftCardDetails, setGiftCardDetails] = useState(null);

  //   get gift card data from session storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = sessionStorage.getItem("gift_card_details");
      if (data) {
        setGiftCardDetails(JSON.parse(data));
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("gift_card_details");
      }
    };
  }, []);

  const header = {
    color: "#232323",
    fontSize: isMobile ? "16px" : "22px",
    fontWeight: "700",
    mb: 1,
  };
  const text = {
    color: "#232323",
    fontSize: isMobile ? "12px" : "15px",
    fontWeight: "500",
  };

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id).then(
      () => {
        toast.success(`${t.copySuccess}, ${id}`);
      },
      (err) => {}
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                   misPay callback handling after payment                   */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const enc = router?.query?._;
    if (!enc) return;

    try {
      const secret = process.env.NEXT_PUBLIC_MIS_API_KEY;
      const dec = decryptAES(
        Buffer.from(enc, "base64").toString("utf8"),
        secret
      );
      setDecrypted(dec);
    } catch (e) {
      console.error("Decrypt error:", e);
    }
  }, [router]);

  useEffect(() => {
    if (decrypted) {
      //   status code for mispay response
      //   MP00 -> success
      //   MP01 -> timeout
      //   MP02 ->  Cancelled
      //   MP03 -> refunded

      const messages = {
        MP01: t.paymentFailure,
        MP02: t.paymentCancelled,
        MP03: t.paymentCancelled,
      };
      // handle fail in marketplace or spareparts pay failed
      if (messages[decrypted?.code]) {
        router.push("/userProfile/gift/chooseGift");
      }
    }
  }, [decrypted]);

  return (
    <div className={`${style["confirmation"]}`}>
      <div className={`${style["confirmation_thank"]}`}>{t.thankYou}</div>
      <div className={`${style["numberSection"]}`}>
        <div className={`${style["numberSection_num"]}`}>
          <div className={`${style["numberSection_num-holder"]}`}>
            {t.orderNum}:
          </div>
          <div className={`${style["numberSection_num-id"]}`}>
            {giftCardDetails?.reference_code || ""}
          </div>
          <div>
            <ContentCopyIcon
              sx={{ cursor: "pointer", width: isMobile ? "17px" : "auto" }}
              onClick={() => handleCopy(giftCardDetails?.reference_code)} // Add onClick handler
            />
          </div>
        </div>
        <div className={`${style["numberSection_hint"]}`}>
          {t.confirmMessage}
        </div>
      </div>

      <div className={`${style["deliverySec"]}`}>
        <div>
          <Image
            loading="lazy"
            src="/icons/wallet-yellow.svg"
            width={24}
            height={24}
            alt="pay-method"
          />
        </div>
        <div className={`${style["deliverySec_address"]}`}>
          <div className={`${style["deliverySec_address-holder"]}`}>
            {t.paymentMethod}
          </div>
          <div className={`${style["deliverySec_address-location"]}`}>
            {availablePaymentMethodImages(
              { payment_method: giftCardDetails?.payment_method },
              isMobile
            )}
          </div>
        </div>
      </div>

      <div className={`${style["details"]}`}>
        <div className={`${style["details-header"]}`}>
          <Image
            loading="lazy"
            src="/icons/brakes-yellow.svg"
            alt="alert"
            width={24}
            height={24}
          />
          {t.orderData}
        </div>
        <div className={`${style["details-parts"]}`}>
          <div
            className={`${style["details-parts_imgHolder"]}`}
            style={{
              width: "100px",
            }}
          >
            <Image
              loading="lazy"
              src={
                giftCardDetails?.selectedGift?.url || "/imgs/no-img-holder.svg"
              }
              width={isMobile ? 50 : 70}
              height={isMobile ? 50 : 70}
              alt={1}
              onError={(e) => (e.target.srcset = "/imgs/no-prod-img.svg")} // Fallback to default image
              style={{
                width: "100%",
              }}
            />
          </div>
          <div className={`${style["details-parts_details"]}`}>
            <div className={`${style["details-parts_details-name"]}`}>
              بطاقة هدايا - {giftCardDetails?.price} {riyalImgBlack()}
            </div>
          </div>
        </div>
      </div>

      <Box
        sx={{
          width: isMobile ? "100%" : "50%",
          mb: 5,
        }}
      >
        <Box sx={header}>{t.orderSummary}</Box>
        <Box className="d-flex justify-content-between mb-2">
          <Box sx={text}>{t.giftCardValue}</Box>
          <Box sx={text}>
            {giftCardDetails?.price} {riyalImgBlack()}
          </Box>
        </Box>
        <Box className="d-flex justify-content-between mb-2">
          <Box sx={text}>{t.quantity}</Box>
          <Box sx={text}>1</Box>
        </Box>
      </Box>

      <div className="d-flex justify-content-center">
        <SharedBtn
          onClick={() => router.push("/userProfile/myOrders")}
          text="goOrder"
          className="big-main-btn"
          customStyle={{
            width: "450px",
          }}
        />
      </div>
    </div>
  );
}

export default GiftCardsConfirmation;
