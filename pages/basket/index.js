import AtlobhaPartners from "@/components/Marketplace/AtlobhaPartners";
import useLocalization from "@/config/hooks/useLocalization";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "../../components/shared/Navbar/ContentForBasketPopup/ContentForBasket.module.scss";
import SharedBtn from "@/components/shared/SharedBtn";
import { useRouter } from "next/router";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { latestUpdatedCart } from "@/constants/helpers";
import { Box } from "@mui/material";
import BasketDataReused from "../../components/Basket/BasketDataReused";
import AvailablePaymentMethodsImgs from "@/components/spareParts/AvailablePaymentMethodsImgs";
import Login from "@/components/Login";
import LoginModalActions from "@/constants/LoginModalActions/LoginModalActions";
import { isAuth } from "@/config/hooks/isAuth";
import { fetchCartAsync } from "@/redux/reducers/basketReducer";
import ProgressBarMinFreeDeliery from "@/components/Basket/ProgressBarMinFreeDeliery";
import RecentlyViewed from "@/components/Marketplace/RecentlyViewed";

function Basket() {
  const { isMobile } = useScreenSize();
  const dispatch = useDispatch();
  const { basket, loadingCart } = useSelector((state) => state.basket);
  const { t, locale } = useLocalization();
  const router = useRouter();
  const [prodIdClicked, setProdIdClicked] = useState(false);
  const { setOpenLogin, showBtn, openLogin } = LoginModalActions();
  const { selectedAddress, defaultAddress, endpointCalledAddress } =
    useSelector((state) => state.selectedAddress);
  const [citySettings, setCitySettings] = useState({
    delivery_free_price: 0,
    minimum_order_fee: 0,
  });
  const totalOfBasket = basket
    ?.filter((item) => item?.product?.is_active)
    ?.reduce((sum, item) => sum + item.quantity * item.product.price, 0)
    ?.toFixed(2);

  const noImgStyle = {
    borderRadius: "8px",
    opacity: "1",
    width: "100%",
    height: "100%",
    margin: "auto",
  };

  const handleChangeProdQty = (e, data) => {
    setProdIdClicked(data?.product?.id);
    setTimeout(() => {
      setProdIdClicked(false);
    }, 3000);
    e?.stopPropagation();
    e?.preventDefault();
  };

  //   remove auto open the address form
  //   useEffect(() => {
  //     const timeout = setTimeout(() => {
  //       if (
  //         typeof document !== "undefined" &&
  //         !selectedAddress?.id &&
  //         (!defaultAddress?.id || defaultAddress?.id === "currentLocation") &&
  //         isAuth() &&
  //         endpointCalledAddress
  //       ) {
  //         document.getElementById("openAddAddressModalProgramatically")?.click();
  //       }
  //     }, 1000); // Wait 1 second after DOM is ready

  //     return () => clearTimeout(timeout); // Clean up
  //   }, [endpointCalledAddress]);

  useEffect(() => {
    dispatch(fetchCartAsync());

    const totalPriceBasket = basket
      ?.filter((item) => item?.product?.is_active)
      ?.reduce((sum, item) => sum + item.quantity * item.product.price, 0)
      ?.toFixed(2);

    const itemsMaping = basket
      ?.filter((item) => item?.product?.is_active)
      ?.map((bas) => ({
        Id: bas?.product?.id || "",
        Title: bas?.product?.name || "",
        Price: bas?.product?.price || "",
        Quantity: bas?.quantity || "",
        Image: bas?.product?.image || "",
      }));

    window.webengage.onReady(() => {
      webengage.track("CART_VIEWED", {
        total: totalPriceBasket || 0,
        number_of_products:
          basket?.filter((item) => item?.product?.is_active)?.length || 0,
        line_items: itemsMaping || [],
      });
      window.gtag("event", "CART_VIEWED", {
        total: totalPriceBasket || 0,
        number_of_products:
          basket?.filter((item) => item?.product?.is_active)?.length || 0,
        line_items: itemsMaping || [],
      });
    });

    latestUpdatedCart(basket);
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 mt-3">
          {!basket?.length ? (
            <div className="text-center p-5 mb-5">
              <Image
                loading="lazy"
                src="/icons/empty-basket.svg"
                width={117}
                height={106}
                alt="empty-basket"
              />
              <div className={style["basket-empty"]}>{t.emptyBasket}</div>
              <div className={style["basket-hint"]}>{t.canShopParts}</div>
              <SharedBtn
                className="big-main-btn"
                customClass={`${isMobile ? "w-75" : "w-50"} mt-3`}
                text="continueShopping"
                onClick={() => router.push("/")}
              />
            </div>
          ) : (
            <div className="row pt-4">
              <div className="col-12 mb-4">
                <Box
                  sx={{
                    borderRadius: "20px",
                    background: "#FEFCED",
                    padding: isMobile ? "5px" : "16px",
                    display: "flex",
                    gap: "16px",
                    alignItems: "center",
                  }}
                >
                  <Image
                    loading="lazy"
                    src="/icons/part-img.svg"
                    alt="part-img"
                    width={isMobile ? 27 : 54}
                    height={isMobile ? 27 : 54}
                  />
                  <Box>
                    <Box
                      sx={{
                        color: "#EE772F",
                        fontSize: isMobile ? "14px" : "24px",
                        fontWeight: "500",
                      }}
                    >
                      {t.partsAvailable}
                    </Box>
                    <Box
                      sx={{
                        color: "#6B7280",
                        fontSize: isMobile ? "10px" : "20px",
                        fontWeight: "500",
                      }}
                    >
                      {t.partAvailableInfo}{" "}
                    </Box>
                  </Box>
                </Box>
              </div>
              <div className="col-md-8 col-12 mb-3">
                <BasketDataReused />
              </div>
              <div className="col-md-4 col-12 mb-3">
                <Box
                  sx={{
                    fontSize: isMobile ? "16px" : "24px",
                    fontWeight: "500",
                    marginTop: "15px",
                    mb: 3,
                  }}
                >
                  {basket?.filter((item) => item?.product?.is_active)?.length}{" "}
                  {t.basketQty}
                </Box>

                {/* progress bar */}
                {isAuth() && (
                  <ProgressBarMinFreeDeliery
                    citySettings={citySettings}
                    setCitySettings={setCitySettings}
                  />
                )}

                <Box
                  sx={{
                    mb: 3,
                  }}
                >
                  <SharedBtn
                    className="big-main-btn"
                    customClass="w-100 mt-3"
                    text="continueCheckout"
                    disabled={
                      +totalOfBasket < +citySettings?.minimum_order_fee ||
                      loadingCart
                    }
                    onClick={() => {
                      if (
                        !selectedAddress?.id &&
                        (!defaultAddress?.id ||
                          defaultAddress?.id === "currentLocation") &&
                        isAuth()
                      ) {
                        return document
                          .getElementById("openAddAddressModalProgramatically")
                          ?.click();
                      }
                      if (isAuth()) {
                        return router.push("/checkout");
                      } else {
                        return setOpenLogin(true);
                      }
                    }}
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <AvailablePaymentMethodsImgs />
                </Box>
              </div>
              <div className="col-12 mb-3">
                <RecentlyViewed
                  sectionInfo={{
                    id: "randomID",
                    is_active: true,
                    requires_authentication: true,
                    title: t.suggestedProducts,
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="col-12 mt-3">
          <AtlobhaPartners
            sectionInfo={{
              is_active: true,
              title: t.partsAreOriginal,
              textAlign: "center",
              textColor: "#6B7280",
              customFont: "16px",
            }}
          />
        </div>
      </div>
      <Login
        showBtn={!showBtn}
        open={openLogin}
        setOpen={setOpenLogin}
        id="fourLogin"
        customIDOtpField="fourOtpField"
        customIDLogin="fourBtnLogin"
      />
    </div>
  );
}

export default Basket;
