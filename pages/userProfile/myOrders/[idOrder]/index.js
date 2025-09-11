import useScreenSize from "@/constants/screenSize/useScreenSize";
import { useRouter } from "next/router";
import React from "react";
import UserProfile from "../..";
import BreadCrumb from "@/components/BreadCrumb";
import useCustomQuery from "@/config/network/Apiconfig";
import { ORDERSENUM } from "@/constants/enums";
import {
  MAINTENANCE_RESERVATIONS,
  ORDERS,
  PORTABLE_MAINTENANCE_RESERVATIONS,
  SPARE_PARTS,
} from "@/config/endPoints/endPoints";
import SparePartsOrderDetails from "@/components/userProfile/orderDetails/sparePartsOrderDetails";
import { toast } from "react-toastify";
import useLocalization from "@/config/hooks/useLocalization";
import MarketplaceOrderDetails from "@/components/userProfile/orderDetails/marketplaceOrderDetails";
import ServiceOrderDetails from "@/components/userProfile/orderDetails/serviceOrderDetails";

function OrderDetails() {
  const router = useRouter();
  const { idOrder, type } = router.query;
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();

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
      default:
        return type;
    }
  };

  const {
    data,
    isFetching: orderDetailsFetching,
    refetch: callSingleOrder,
  } = useCustomQuery({
    name: ["singleOrderData"],
    url: renderUrlDependOnType(),
    refetchOnWindowFocus: false,
    enabled: !!idOrder,
    select: (res) => res?.data?.data,
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
      default:
        return type;
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {!isMobile && (
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
