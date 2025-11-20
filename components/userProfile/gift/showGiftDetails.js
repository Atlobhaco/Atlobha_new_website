import React from "react";
import style from "../../../pages/spareParts/confirmation/confirmation.module.scss";
import Image from "next/image";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { riyalImgBlack } from "@/constants/helpers";

function ShowGiftDetails({ giftCardDetails, noMarginBottom = false }) {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();

  return (
    <div className={`${noMarginBottom ? "mb-0" : "mb-5"}`}>
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
            {t.gift} - {giftCardDetails?.price} {riyalImgBlack()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowGiftDetails;
