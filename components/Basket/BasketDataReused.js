import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import BasketItem from "./BasketItem";

function BasketDataReused({ handleCloseBasket = () => {} }) {
  const { basket, loadingCart } = useSelector((state) => state.basket);
  const router = useRouter();
  const [prodIdClicked, setProdIdClicked] = useState(false);
  const [activeServiceCenter, setActiveServiceCenter] = useState(null);

  const handleChangeProdQty = (e, data) => {
    setProdIdClicked(data?.product?.id);
    setTimeout(() => setProdIdClicked(false), 3000);
    e.stopPropagation();
    e.preventDefault();
  };

  const handleRedirectToProdDetails = (data) => {
    router.push({
      pathname: `/product/${data?.product?.id}`,
      query: {
        name: data?.product?.name,
        desc: data?.product?.desc,
        tags: data?.product?.combined_tags?.[0]?.name_ar,
        category: data?.product?.marketplace_category?.name,
        subCategory: data?.product?.marketplace_subcategory?.name,
        model: data?.product?.model?.name,
        num: data?.product?.ref_num,
        price: data?.product?.price,
        img: data?.product?.image,
      },
    });
    handleCloseBasket();
  };

  return (
    <>
      {[...basket]
        ?.sort(
          (a, b) =>
            (b?.product?.is_active === true) - (a?.product?.is_active === true)
        )
        ?.map((data) => (
          <BasketItem
            key={data?.id}
            data={data}
            handleRedirectToProdDetails={handleRedirectToProdDetails}
            handleChangeProdQty={handleChangeProdQty}
            loadingCart={loadingCart}
            prodIdClicked={prodIdClicked}
            setActiveServiceCenter={setActiveServiceCenter}
            activeServiceCenter={activeServiceCenter}
          />
        ))}
    </>
  );
}

export default BasketDataReused;
