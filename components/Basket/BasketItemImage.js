import React from "react";
import Image from "next/image";
import style from "../../components/shared/Navbar/ContentForBasketPopup/ContentForBasket.module.scss";
import useScreenSize from "@/constants/screenSize/useScreenSize";

function BasketItemImage({ data, handleRedirectToProdDetails }) {
  const { isMobile } = useScreenSize();

  return (
    <div
      className={style["products-contain_img"]}
      onClick={() => handleRedirectToProdDetails(data)}
    >
      <Image
        src={data?.product?.image?.url || "/imgs/no-img-holder.svg"}
        width={isMobile ? 55 : 55}
        height={isMobile ? 55 : 55}
        alt={data?.id}
        onError={(e) => (e.target.srcset = "/imgs/no-prod-img.svg")}
        style={{
          cursor: "pointer",
          maxWidth: "100%",
          maxHeight: "100%",
          borderRadius: "8px",
          margin: "auto",
          objectFit: "cover",
          minWidth: isMobile ? 55 : 55,
          height: isMobile ? 55 : 55,
        }}
        loading="lazy"
      />
    </div>
  );
}

export default BasketItemImage;
