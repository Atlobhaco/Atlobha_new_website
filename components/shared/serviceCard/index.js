import React from "react";
import style from "./serviceCard.module.scss";
import Image from "next/image";
import { riyalImgOrange, riyalImgRed } from "@/constants/helpers";
import { Tooltip } from "@mui/material";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import useLocalization from "@/config/hooks/useLocalization";
import { useRouter } from "next/router";

function ServiceCard({ service = {} }) {
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();
  const router = useRouter();

  return (
    <div
      className={`${style["service"]}`}
      onClick={() => {
        router.push({
          pathname: `/service/${service?.id}`,
          query: {
            portableService: router?.query?.portableService || "no-info",
            secType: router?.query?.secType,
            name: service?.name,
            desc: service?.description,
            tags: service?.combined_tags?.[0]?.name_ar,
            category: service?.category?.name,
            price: service?.price,
            img: service?.thumbnail?.url,
          },
        });
      }}
    >
      <div className={`${style["service-img"]}`}>
        <Image
          loading="lazy"
          src={service?.thumbnail?.url || "/imgs/no-prod-img.svg"}
          alt="Product"
          width={200}
          height={200}
          onError={(e) => (e.target.srcset = "/imgs/no-prod-img.svg")} // Fallback to default image
          style={{
            width: "auto",
            height: "auto",
            maxWidth: "100%",
            maxHeight: "100%",
            borderRadius: "8px",
            margin: "auto",
            minWidth: isMobile ? "50px" : "93px",
            minHeight: isMobile ? "35px" : "60px",
          }}
        />
      </div>
      <div className={`${style["service-info"]}`}>
        <div className={`${style["service-info_title"]}`}>
          <Tooltip
            title={service?.name}
            placement="top"
            enterDelay={200}
            leaveDelay={200}
            arrow
          >
            {service?.name}
          </Tooltip>{" "}
        </div>
        <div className={`${style["service-info_price"]}`}>
          {!!service?.price_before_discount && (
            <div className={`${style["service-info_price-old--price"]}`}>
              {service?.price_before_discount?.toFixed(2)}
            </div>
          )}
          <div
            className={`${
              style[
                !!service?.price_before_discount
                  ? "service-info_price-has--disc"
                  : "service-info_price-no--disc"
              ]
            }`}
          >
            {service?.price?.toFixed(2) || 0}{" "}
            {!!service?.price_before_discount
              ? riyalImgRed()
              : riyalImgOrange()}
          </div>
        </div>
        <button className={`${style["service-info_reserve"]}`}>
          {t.orderServiceAgain}
        </button>
      </div>
    </div>
  );
}

export default ServiceCard;
