import Login from "@/components/Login";
import DeliveryTime from "@/components/ProductDetails/DeliveryTime";
import DetailsProd from "@/components/ProductDetails/DetailsProd";
import AvailableTimeFotServicePortable from "@/components/ServiceDetails/AvailableTimeFotServicePortable";
import RedirectToCheckoutService from "@/components/ServiceDetails/RedirectToCheckoutService";
import ServiceCompatibleWith from "@/components/ServiceDetails/ServiceCompatibleWith";
import ServiceImages from "@/components/ServiceDetails/ServiceImages";
import ServiceStoreSelections from "@/components/ServiceDetails/ServiceStoreSelections";
import ServiceTitlePrice from "@/components/ServiceDetails/ServiceTitlePrice";
import ProductCardSkeleton from "@/components/cardSkeleton";
import { SERVICES } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import LoginModalActions from "@/constants/LoginModalActions/LoginModalActions";
import { FIXED, PORTABLE } from "@/constants/enums";
import { servicePrice } from "@/constants/helpers";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, Tab, Tabs } from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function ServiceDetails() {
  const { t } = useLocalization();
  const { setOpenLogin, showBtn, openLogin } = LoginModalActions();
  const shownRef = useRef(false);
  const { selectedCar, defaultCar } = useSelector((state) => state.selectedCar);

  const {
    query: { portableService, idService, servicePayFailed },
  } = useRouter();
  const router = useRouter();

  const { isMobile } = useScreenSize();
  const [cityDelivery, setCityDelivery] = useState(14);
  const [tabValue, setTabValue] = React.useState(false);
  const [selectNewDate, setSelectNewDate] = useState(dayjs());
  const [selectedStore, setSelectedStore] = useState(false);
  const [selectedStoreTime, setSelectedStoreTime] = useState(false);
  const [selectedDatePortable, setSelectedDatePortable] = useState(dayjs());
  const [selectedPortableTime, setSelectedPortableTime] = useState(false);
  const [allStores, setAllStores] = useState(false);
  const [userConfirmStoreDate, setUserConfirmStoreDate] = useState(false);

  const handleChange = (event, newValue) => {
    setSelectedPortableTime(false);
    setSelectedStoreTime(false);
    setTabValue(newValue);
  };

  const {
    data,
    isFetching: ProdDetailsFetch,
    refetch: callProdDetails,
  } = useCustomQuery({
    name: ["serviceDetails", idService],
    url: `${SERVICES}/${idService}`,
    refetchOnWindowFocus: false,
    enabled: !!idService,
    select: (res) => res?.data?.data,
    onError: (err) => {
      toast.error(t.someThingWrong);
    },
  });

  useEffect(() => {
    if (data?.id && portableService) {
      if (portableService === "false") {
        return setTabValue(FIXED);
      }
      if (portableService === "true") {
        return setTabValue(PORTABLE);
      }
      if (portableService === "no-info") {
        if (
          data?.qualifies_as_portable_service &&
          data?.qualifies_as_store_service
        ) {
          return setTabValue(FIXED);
        }
        if (data?.qualifies_as_portable_service) {
          return setTabValue(PORTABLE);
        }
        if (data?.qualifies_as_store_service) {
          return setTabValue(FIXED);
        }
      }
      window.webengage.onReady(() => {
        webengage.track("SERVICE_VIEWED", {
          serivce_id: data?.id?.toString() || "",
          serivce_name: data?.name || "",
          price:
            Number(
              servicePrice({
                service: data,
                userCar: selectedCar?.id ? selectedCar : defaultCar,
              })
            ) || "",
          car_brand: data?.brand?.name || "",
          car_model: data?.model?.name || "",
          car_year: Number(data?.year_from) || Number("1990"),
          reference_number: data?.id?.toString(),
          service_details: data?.description || "",
          service_url: `/service/${idService}` || "",
          category: data?.category?.name || "",
          tags: data?.combined_tags?.map((d) => d?.name) || [],
        });
      });
    }
  }, [data]);

  //   check if the checkout service failed in pay then do the logic
  useEffect(() => {
    if (router.query.servicePayFailed === "true" && !shownRef.current) {
      shownRef.current = true; // ✅ prevent duplicate
      toast.error(t.paymentCancelled);

      const updatedQuery = { ...router.query };
      delete updatedQuery.servicePayFailed;

      router.replace(
        { pathname: router.pathname, query: updatedQuery },
        undefined,
        { shallow: true }
      );
      setTimeout(() => {
        shownRef.current = false;
      }, 2000);
    }
  }, [router.query.servicePayFailed]);

  return (
    <Box>
      {ProdDetailsFetch ? (
        <ProductCardSkeleton height={"400px"} />
      ) : (
        <Box className="container">
          <Box className="row">
            <Box
              className={`col-12 col-md-12 ${
                isMobile ? "mt-3 mb-5 pb-3" : "mt-5"
              }`}
            >
              {data && <ServiceImages prod={data} />}

              {data?.qualifies_as_portable_service &&
                data?.qualifies_as_store_service && (
                  <Box
                    sx={{
                      width: "100%",
                      borderBottom: "1px solid #E6E6E6",
                      mb: 3,
                    }}
                  >
                    <Tabs
                      value={tabValue}
                      onChange={handleChange}
                      centered
                      textColor="inherit" // ✅ Allow custom color
                      TabIndicatorProps={{
                        style: {
                          backgroundColor: "black", // ✅ Underline color
                        },
                      }}
                    >
                      <Tab
                        label={t.insideCenter}
                        value={FIXED}
                        sx={{
                          color: "black", // ✅ Default text color
                          fontSize: "12px",
                          "&.Mui-selected": {
                            color: "black", // ✅ Selected text color
                          },
                        }}
                      />
                      <Tab
                        label={t.inYourPlace}
                        value={PORTABLE}
                        sx={{
                          color: "black",
                          fontSize: "12px",
                          "&.Mui-selected": {
                            color: "black",
                          },
                        }}
                      />
                    </Tabs>
                  </Box>
                )}

              <ServiceTitlePrice prod={data} tabValue={tabValue} />

              <ServiceCompatibleWith
                prod={{
                  ...data,
                  model: data?.service_models?.length
                    ? data?.service_models[0]
                    : {},
                }}
              />

              {/* <DeliveryTime
                prod={data}
                cityDelivery={cityDelivery}
                setCityDelivery={setCityDelivery}
              /> */}

              <DetailsProd prod={data} />

              {tabValue === FIXED && (
                <ServiceStoreSelections
                  prod={data}
                  selectNewDate={selectNewDate}
                  handleDateChange={(newValue) => {
                    setSelectedStoreTime(false);
                    setSelectNewDate(newValue);
                  }}
                  selectedStore={selectedStore}
                  setSelectedStore={setSelectedStore}
                  selectedStoreTime={selectedStoreTime}
                  setSelectedStoreTime={setSelectedStoreTime}
                  setOpenLogin={setOpenLogin}
                  setAllStores={setAllStores}
                  setUserConfirmStoreDate={setUserConfirmStoreDate}
                  userConfirmStoreDate={userConfirmStoreDate}
                  setSelectNewDate={setSelectNewDate}
                />
              )}

              {tabValue === PORTABLE && (
                <AvailableTimeFotServicePortable
                  prod={data}
                  selectedDatePortable={selectedDatePortable}
                  setSelectedDatePortable={setSelectedDatePortable}
                  selectedPortableTime={selectedPortableTime}
                  setSelectedPortableTime={setSelectedPortableTime}
                  setOpenLogin={setOpenLogin}
                />
              )}

              <RedirectToCheckoutService
                prod={data}
                setOpenLogin={setOpenLogin}
                tabValue={tabValue}
                selectedPortableTime={selectedPortableTime}
                selectedStoreTime={selectedStoreTime}
                allStores={allStores}
                selectedDatePortable={selectedDatePortable}
                userConfirmStoreDate={userConfirmStoreDate}
                selectedStore={selectedStore}
              />
            </Box>
          </Box>
        </Box>
      )}

      <Login
        showBtn={!showBtn}
        open={openLogin}
        setOpen={setOpenLogin}
        id="fifthLogin"
        customIDOtpField="FifthOtpField"
        customIDLogin="FifthBtnLogin"
      />
    </Box>
  );
}

export default ServiceDetails;
