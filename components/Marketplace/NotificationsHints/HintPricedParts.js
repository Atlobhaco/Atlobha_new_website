import React, { useState } from "react";
import ColoredHint from "../../ColoredHint";
import useLocalization from "@/config/hooks/useLocalization";
import { useRouter } from "next/router";
import { isAuth } from "@/config/hooks/isAuth";
import useCustomQuery from "@/config/network/Apiconfig";
import { Box, Rating } from "@mui/material";
import { Carousel } from "react-bootstrap";
import Slider from "react-slick";
import style from "./HintPricedParts.module.scss";
import Image from "next/image";
import SharedBtn from "@/components/shared/SharedBtn";
import { STATUS } from "@/constants/enums";
import {
  DISMISS,
  MARK_READ,
  ORDER_STATUS_NOTIFICATIONS,
} from "@/config/endPoints/endPoints";

function HintPricedParts({ sectionInfo }) {
  const router = useRouter();
  const { t, locale } = useLocalization();
  const [notification, SetNotification] = useState([]);
  const [activeIndex, setActiveIndex] = useState(false);
  const [idOrderToDismiss, setIdOrderDismiss] = useState(false);
  const [idOrderToRead, setIdOrderRead] = useState(false);
  const [rating, setRating] = useState(1);

  /* -------------------------------------------------------------------------- */
  /*                            get notification list                           */
  /* -------------------------------------------------------------------------- */
  const { refetch } = useCustomQuery({
    name: "allNotifications",
    url: `${ORDER_STATUS_NOTIFICATIONS}`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    onSuccess: (res) =>
      SetNotification([...res, { id: "last-page", type: "last-page" }]),
  });

  /* -------------------------------------------------------------------------- */
  /*                             dismiss notfication                            */
  /* -------------------------------------------------------------------------- */
  useCustomQuery({
    name: ["dismissNotification", idOrderToDismiss],
    method: "patch",
    url: `${ORDER_STATUS_NOTIFICATIONS}/${idOrderToDismiss}${DISMISS}`,
    refetchOnWindowFocus: false,
    enabled: idOrderToDismiss ? true : false,
    select: (res) => res?.data?.data,
    onSuccess: (res) => {
      setIdOrderDismiss(false);
      refetch();
    },
    onError: () => setIdOrderDismiss(false),
  });

  /* -------------------------------------------------------------------------- */
  /*                         mark notificatioin as read                         */
  /* -------------------------------------------------------------------------- */
  useCustomQuery({
    name: ["markAsReadNotification", idOrderToRead],
    method: "patch",
    url: `${ORDER_STATUS_NOTIFICATIONS}/${idOrderToRead}${MARK_READ}`,
    refetchOnWindowFocus: false,
    enabled: idOrderToRead ? true : false,
    select: (res) => res?.data?.data,
    onSuccess: (res) => {
      setIdOrderRead(false);
      refetch();
    },
    onError: () => setIdOrderRead(false),
  });

  if (
    !sectionInfo?.is_active ||
    notification?.length == 0 ||
    (sectionInfo?.requires_authentication && !isAuth())
  )
    return null;

  var settings = {
    dots: true,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    // autoplay: true,
    // touchThreshold: 10,
    // speed: 8000,
    // autoplaySpeed: 8000,
    // cssEase: "linear",
    // rtl: locale === "ar",
    initialSlide: locale === "ar" ? notification?.length - 1 : 0,
    isDragging: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const renderBoxes = (data) => {
    switch (data?.type) {
      case "product_review":
        return (
          <Box className={`${style["prod-review"]}`}>
            <Box className={`${style["prod-review_data"]}`}>
              <Box className={`${style["prod-review_data-img"]}`}>
                <Image
                  src="/imgs/no-img-holder.svg"
                  alt="prod-image"
                  width={35}
                  height={35}
                  loading="lazy"
                />{" "}
                <Box className={`${style["prod-review_data-img_text"]}`}>
                  المصد الأمامي لسيارة كامري
                </Box>
              </Box>
              <Box
                dir={locale === "ar" ? "rtl" : "ltr"}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: locale === "ar" ? "flex-end" : "flex-start",
                }}
              >
                {/* Force Rating logic to LTR, but reverse order using flex direction */}
                <Box
                  sx={{
                    direction: "ltr",
                    display: "flex",
                    flexDirection: locale === "ar" ? "row-reverse" : "row",
                  }}
                >
                  <Rating
                    name="localized-rating"
                    value={rating}
                    precision={0.5}
                    onChange={(event, newValue) => {
                      setRating(newValue);
                    }}
                  />
                </Box>
              </Box>
            </Box>
            <Box className={`${style["prod-review_buttons"]}`}>
              <SharedBtn
                className="black-btn"
                text="confirmOrder"
                customClass={`${style["sm-text"]} w-50 me-2`}
              />
              <SharedBtn
                className="black-btn"
                text="confirmOrder"
                customClass={`${style["sm-text"]}  w-50 me-2`}
              />
            </Box>
          </Box>
        );
      case "order_status_updated":
        if (data?.order?.status === STATUS?.priced) {
          return (
            <Box className={`${style["order-status"]}`}>
              <Box className={`${style["order-status_info"]}`}>
                <Image
                  src="/imgs/pricing-sheet.svg"
                  width={60}
                  height={60}
                  alt="logo-pricing"
                  loading="lazy"
                />
                <Box>
                  <h5>
                    {locale === "ar"
                      ? `${t.youHavePricedOrder} ${data?.order?.id}`
                      : `${t.youHavePricedOrder} ${data?.order?.id} ${t.youHavePricedOrderSecond} `}
                  </h5>
                  <h6>{t.CanConfirmItNow}</h6>
                </Box>
              </Box>
              <SharedBtn
                className="black-btn"
                text="confirmOrder"
                customClass={`${style["sm-text"]}`}
                // onClick={() => {
                //   router.push({
                //     pathname: `/userProfile/myOrders/${data?.order?.id}`,
                //     query: { type: data?.order?.order_type },
                //   });
                //   setIdOrderRead(data?.id);
                // }}
              />
            </Box>
          );
        }
        if (data?.order?.status === STATUS?.shipping) {
          return (
            <Box className={`${style["order-status"]}`}>
              <Box className={`${style["order-status_info"]}`}>
                <Image
                  src="/imgs/yellow-car.svg"
                  width={55}
                  height={33}
                  alt="logo"
                  loading="lazy"
                />
                <Box>
                  <h5>
                    {`${t.orderNumber} ${data?.order?.id} ${t.onDelivery} `}
                  </h5>
                  <h6>{t.nowOnTheWay}</h6>
                </Box>
              </Box>
              <SharedBtn
                className="black-btn"
                customClass={`${style["sm-text"]}`}
                text="trackYourOrder"
              />
            </Box>
          );
        }
        if (data?.order?.status === STATUS?.delivered) {
          return (
            <Box className={`${style["order-status"]}`}>
              <Box className={`${style["order-status_info"]}`}>
                <Image
                  src="/imgs/person-delivered.svg"
                  width={60}
                  height={60}
                  alt="logo-delivered"
                  loading="lazy"
                />
                <Box>
                  <h5>
                    {locale === "ar"
                      ? `${t.orderDoneDelivery} ${data?.order?.id}`
                      : `${t.orderNumber} ${data?.order?.id} ${t.orderDoneDelivery}`}
                  </h5>
                  <h6>{t.deliveredDone}</h6>
                </Box>
              </Box>
              <SharedBtn
                className="black-btn"
                customClass={`${style["sm-text"]}`}
                text="rateYourOrder"
              />
            </Box>
          );
        }
        return <h1>{data?.order?.status}</h1>;

      default:
        return (
          <Box className={`${style["every-thing"]}`}>
            <Image
              src="/imgs/correct-bg-green.svg"
              width={30}
              height={30}
              alt="logo-correct"
              loading="lazy"
            />
            <h5>{t.thisEveryThing}</h5>
          </Box>
        );
    }
  };

  return (
    <Box>
      <Slider {...settings}>
        {notification?.map((prod, index) => (
          <Box key={prod?.id}>
            <Box className={`${style["notify"]}`}>
              {renderBoxes(prod)}
              {/* {prod?.id} */}
            </Box>
            <Box className={`${style["shadow"]}`}></Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}

export default HintPricedParts;
