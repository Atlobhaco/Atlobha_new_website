import useScreenSize from "@/constants/screenSize/useScreenSize";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import UserProfile from "../..";
import BreadCrumb from "@/components/BreadCrumb";
import useCustomQuery from "@/config/network/Apiconfig";
import { ORDERSENUM, STATUS } from "@/constants/enums";
import {
  MAINTENANCE_RESERVATIONS,
  ORDERS,
  PORTABLE_MAINTENANCE_RESERVATIONS,
  SPARE_PARTS,
  USERS,
  VEHICLES,
  VEHICLE_PRICING_ORDERS,
  VOUCHER_PURCHASE,
} from "@/config/endPoints/endPoints";
import SparePartsOrderDetails from "@/components/userProfile/orderDetails/sparePartsOrderDetails";
import { toast } from "react-toastify";
import useLocalization from "@/config/hooks/useLocalization";
import MarketplaceOrderDetails from "@/components/userProfile/orderDetails/marketplaceOrderDetails";
import ServiceOrderDetails from "@/components/userProfile/orderDetails/serviceOrderDetails";
import { useAuth } from "@/config/providers/AuthProvider";
import { useDispatch } from "react-redux";
import { setAllCars, setDefaultCar } from "@/redux/reducers/selectedCarReducer";
import { setPromoCodeAllData } from "@/redux/reducers/addSparePartsReducer";
import GiftCardOrderDetails from "@/components/userProfile/orderDetails/giftCardOrderDetails";
import { analytics } from "@/lib/firebase";
import { logEvent } from "firebase/analytics";

function OrderDetails() {
  const router = useRouter();
  const { idOrder, type } = router.query;
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();
  const [rendered, setRendered] = useState(false);
  const { user } = useAuth();
  const dispatch = useDispatch();

  const { refetch: callUserVehicles } = useCustomQuery({
    name: "getVechiles",
    url: `${USERS}/${user?.data?.user?.id}${VEHICLES}`,
    refetchOnWindowFocus: false,
    enabled: false,
    select: (res) => {
      let cars = res?.data?.data || [];

      // If there’s only one car, force it as default
      if (cars.length === 1) {
        cars = cars.map((car, index) => ({
          ...car,
          is_default: true, // force this one to be default
        }));
      }

      return cars;
    },
    onSuccess: (res) => {
      const defaultCar = res?.find((d) => d?.is_default);
      dispatch(setAllCars({ data: res }));
      dispatch(setDefaultCar({ data: defaultCar }));
    },
    onError: () => {
      dispatch(setAllCars({ data: [] }));
    },
  });

  const renderUrlDependOnType = () => {
    switch (type) {
      case ORDERSENUM?.marketplace:
        return `/marketplace${ORDERS}/${idOrder}`;
      case ORDERSENUM?.spareParts:
        return `${SPARE_PARTS}${ORDERS}/${idOrder}`;
      case ORDERSENUM?.maintenance:
        return `${MAINTENANCE_RESERVATIONS}/${idOrder}`;
      case ORDERSENUM?.PORTABLE:
        return `${PORTABLE_MAINTENANCE_RESERVATIONS}/${idOrder}`;
      case ORDERSENUM?.gift:
        return `${VOUCHER_PURCHASE}/${idOrder}`;
      case ORDERSENUM?.vehiclePricing:
        return `${VEHICLE_PRICING_ORDERS}/${idOrder}`;
      default:
        return type;
    }
  };

  const {
    data,
    isFetching: orderDetailsFetching,
    refetch: callSingleOrder,
  } = useCustomQuery({
    name: ["singleOrderData", idOrder, type, rendered],
    url: renderUrlDependOnType(),
    refetchOnWindowFocus: false,
    enabled: !!idOrder,
    select: (res) => res?.data?.data,
    refetchOnMount: true,
    cacheTime: 0,
    staleTime: 0,
    onSuccess: (res) => {
      if (analytics) {
        logEvent(analytics, "BILL_VIEWED", {
          order_number: idOrder?.toString() || "",
          order_id: Number(idOrder) || "",
        });
      }

      // if there is promo code
      // show it in desgin
      if (
        res?.promo_code &&
        res?.status === STATUS?.priced &&
        type === ORDERSENUM?.spareParts
      ) {
        dispatch(setPromoCodeAllData({ data: res?.promo_code }));
      }
      callUserVehicles();
    },
    // onSuccess: (res) => {
    //   if (loadMoreClicked) {
    //     setOrders((prevOrders) => [...prevOrders, ...res?.data]);
    //   } else {
    //     setOrders(res?.data);
    //   }
    //   setLastPage(res?.meta?.last_page);
    //   setPage(res?.meta?.current_page);
    // },
    onError: (err) => {
      toast.error(t.someThingWrong);
    },
  });

  const returnOrderDetailsPage = () => {
    switch (type) {
      case ORDERSENUM?.marketplace:
        return (
          <MarketplaceOrderDetails
            orderDetails={data}
            callSingleOrder={callSingleOrder}
            orderDetailsFetching={orderDetailsFetching}
          />
        );
      case ORDERSENUM?.PORTABLE:
        return (
          <ServiceOrderDetails
            orderDetails={data}
            callSingleOrder={callSingleOrder}
            orderDetailsFetching={orderDetailsFetching}
          />
        );
      case ORDERSENUM?.maintenance:
        return (
          <ServiceOrderDetails
            orderDetails={data}
            callSingleOrder={callSingleOrder}
            orderDetailsFetching={orderDetailsFetching}
          />
        );
      case ORDERSENUM?.spareParts:
        return (
          <SparePartsOrderDetails
            orderDetails={data}
            callSingleOrder={callSingleOrder}
            orderDetailsFetching={orderDetailsFetching}
          />
        );
      case ORDERSENUM?.gift:
        return (
          <GiftCardOrderDetails
            orderDetails={data}
            callSingleOrder={callSingleOrder}
            orderDetailsFetching={orderDetailsFetching}
          />
        );
      case ORDERSENUM?.vehiclePricing:
        return (
          <VehiclePricingDetails
            orderDetails={data}
            orderDetailsFetching={orderDetailsFetching}
            callSingleOrder={callSingleOrder}
          />
        );
      default:
        return type;
    }
  };
  //   to prevent hydration error
  useEffect(() => {
    setRendered(true);
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        {!isMobile && rendered && (
          <div className="col-md-4">
            <UserProfile />
          </div>
        )}
        <div className="col-md-8 col-12 pt-4">
          <div className="row mb-2">
            <BreadCrumb />
          </div>
          {/* OrderDetails-{idOrder} */}
          {returnOrderDetailsPage()}
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
