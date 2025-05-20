import React, { useState } from "react";
import style from "./ContentForBasket.module.scss";
import useLocalization from "@/config/hooks/useLocalization";
import { useSelector } from "react-redux";
import Image from "next/image";
import SharedBtn from "../../SharedBtn";
import BlurText from "../../BlurText";
import { useRouter } from "next/router";
import BasketDataReused from "@/components/Basket/BasketDataReused";

function ContentForBasket({ handleCloseBasket = () => {} }) {
  const router = useRouter();
  const { t } = useLocalization();
  const { basket } = useSelector((state) => state.basket);

  return (
    <div className={style["basket"]}>
      <div className={style["basket-header"]}>{t.shoppingCart}</div>
      {!basket?.length ? (
        <div className="text-center">
          <Image
            src="/icons/empty-basket.svg"
            width={117}
            height={106}
            alt="empty-basket"
          />
          <div className={style["basket-empty"]}>{t.emptyBasket}</div>
          <div className={style["basket-hint"]}>{t.canShopParts}</div>
          <SharedBtn
            className="big-main-btn"
            customClass="w-100 mt-3"
            text="continueShopping"
            onClick={() => {
              router.push("/");
              handleCloseBasket();
            }}
          />
        </div>
      ) : (
        <>
          <div className={style["count"]}>
            <BlurText
              text={`${
                basket?.filter((item) => item?.product?.is_active)?.length
              } ${t.basketQty}`}
              delay={1}
              animateBy="words"
              direction="bottom"
              onAnimationComplete={() => {}}
              className=""
            />
          </div>
          <div className={style["products"]}>
            <div>
              <BasketDataReused handleCloseBasket={handleCloseBasket} />
            </div>
          </div>
          <SharedBtn
            className="big-main-btn"
            customClass="w-100 mt-3"
            text="continueCheckout"
            onClick={() => {
              router.push("/basket");
              handleCloseBasket();
            }}
          />
        </>
      )}
    </div>
  );
}

export default ContentForBasket;
