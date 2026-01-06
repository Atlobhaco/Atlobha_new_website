import DialogCentered from "@/components/DialogCentered";
import SharedBtn from "@/components/shared/SharedBtn";
import {
  REQUEST_REFUND,
  VEHICLE_PRICING_ORDERS,
} from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { STATUS, VEHICLE_PRICING } from "@/constants/enums";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, CircularProgress, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function ActionsOrderPricing({ orderDetails, callSingleOrder }) {
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();
  const [openRefund, setOpenRefund] = useState(false);
  const router = useRouter();
  const { allGroups } = useSelector((state) => state.appGroups);
  const { idOrder } = router.query;

  const {
    data,
    isFetching: refundFetching,
    refetch: refetchRefund,
  } = useCustomQuery({
    name: "refundOrderVehicle",
    url: `${VEHICLE_PRICING_ORDERS}/${idOrder}${REQUEST_REFUND}`,
    refetchOnWindowFocus: false,
    enabled: false,
    method: "post",
    onSuccess: () => callSingleOrder(),
    onError: (err) => {
      toast.error(err?.response?.data?.message || t.someThingWrong);
    },
  });

  return (
    <div className="row mt-4">
      <div
        className={`col-md-auto ${
          orderDetails?.status !== STATUS?.incomplete ? "col-12" : "col-6"
        }`}
      >
        <SharedBtn
          className="big-main-btn"
          customClass="w-100"
          text="newOrder"
          onClick={() =>
            router.push(
              `/sections?secTitle=${
                allGroups[1]?.sections?.find(
                  (sec) => sec?.type === VEHICLE_PRICING
                )?.title
              }&secType=${VEHICLE_PRICING}`
            )
          }
        />
      </div>
      {orderDetails?.status === STATUS?.incomplete &&
        orderDetails?.able_to_refund && (
          <div className="col-md-auto col-6">
            <SharedBtn
              className="big-main-btn"
              customClass="w-100"
              text="refundOrder"
              onClick={() => setOpenRefund(true)}
            />
          </div>
        )}
      <DialogCentered
        title={null}
        subtitle={false}
        open={openRefund}
        setOpen={setOpenRefund}
        hasCloseIcon
        content={
          <Box>
            <Typography
              variant="h5"
              component="h5"
              color="#000"
              fontWeight="700"
              align="center"
              fontSize={isMobile ? "18px" : "auto"}
            >
              {t.refundMoney}
            </Typography>
            <Typography
              variant="h6"
              component="h6"
              color="#000"
              fontWeight="500"
              align="center"
              fontSize={isMobile ? "14px" : "auto"}
            >
              {t.willSendRefund}
            </Typography>
            <Box height={isMobile ? 150 : 320} mt={2}>
              <Image
                loading="lazy"
                src="/imgs/refund-img.svg"
                alt="refund-img"
                style={{
                  width: "100%",
                  height: "100%",
                }}
                width="100"
                height="100"
              />
            </Box>
            <div className={`row mt-3 ${isMobile ? "" : "mx-5"}`}>
              <div className="col-6">
                <SharedBtn
                  className="big-main-btn"
                  customClass="w-100"
                  text="ok"
                  onClick={() => refetchRefund()}
                  disabled={refundFetching}
                  compBeforeText={
                    refundFetching && (
                      <CircularProgress
                        size={12}
                        sx={{
                          color: "black",
                          mx: 1,
                        }}
                      />
                    )
                  }
                />
              </div>
              <div className="col-6">
                <SharedBtn
                  className="outline-btn"
                  customClass="w-100"
                  text="common.cancel"
                  onClick={() => setOpenRefund(false)}
                />
              </div>
            </div>
          </Box>
        }
      />
    </div>
  );
}

export default ActionsOrderPricing;
