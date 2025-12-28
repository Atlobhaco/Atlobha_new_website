import DialogCentered from "@/components/DialogCentered";
import SharedBtn from "@/components/shared/SharedBtn";
import { MODELS, SPECS } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";

function CarDetailsOrderPricings({ style, orderDetails, cololredBoxStyle }) {
  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();
  const [openVariantGroups, setOpenVariantGroups] = useState(false);
  const [selectedHeaderGroup, setSelectedHeaderGroup] = useState(null);

  const { data: carVariantRes } = useCustomQuery({
    name: ["list-specs-for-details", orderDetails?.model?.id],
    url: `${MODELS}/${orderDetails?.model?.id}${SPECS}`,
    refetchOnWindowFocus: false,
    enabled: orderDetails?.model?.id && orderDetails?.variant ? true : false,
    select: (res) =>
      res?.data?.data?.find(
        (d) =>
          d?.variant?.toLowerCase() === orderDetails?.variant?.toLowerCase()
      ),
    onSuccess: (res) => setSelectedHeaderGroup(res?.group[0]),
  });

  return (
    <>
      <Box className={`mb-3 d-flex align-items-center gap-2`}>
        <Image
          src="/icons/car-active.svg"
          alt="car"
          width={isMobile ? 20 : 23}
          height={isMobile ? 20 : 23}
        />
        <Box>
          <Box className={`${style["headers-checkout"]}`}>
            {t.carSpecifications}
          </Box>
          <Box className="d-flex align-items-center gap-3">
            <Image
              src={orderDetails?.brand?.image}
              alt="car-image"
              width={isMobile ? 30 : 40}
              height={isMobile ? 30 : 40}
            />
            <Box className="d-flex flex-column">
              <Box className={`${style["car-info"]}`}>
                {locale === "ar"
                  ? orderDetails?.brand?.name_ar
                  : orderDetails?.brand?.name_en}{" "}
              </Box>
              <Box className={`${style["car-info"]}`}>
                {locale === "ar"
                  ? orderDetails?.model?.name_ar
                  : orderDetails?.model?.name_en}
              </Box>
            </Box>
            <Box className={`${style["car-info"]}`}>{orderDetails?.year}</Box>
          </Box>
        </Box>
      </Box>
      <Box sx={cololredBoxStyle}>
        <Box display="flex" justifyContent="space-between">
          <Box>{t.details}</Box>
          <Box display="flex" alignItems="center" gap="10px">
            {orderDetails?.variant ? t.agencyCar : t.importedCar}
            <Box
              sx={{
                width: "8px",
                height: "8px",
                background: "#22C55E",
                borderRadius: "50%",
              }}
            ></Box>
          </Box>
        </Box>
        <Box className="mt-3">
          {orderDetails?.variant ? (
            <SharedBtn
              customClass="w-100"
              className="big-main-btn"
              text="showMoreDetails"
              comAfterText={
                <Image
                  loading="lazy"
                  src="/icons/arrow-left-sm.svg"
                  width={12}
                  height={12}
                  alt="empty-basket"
                  style={{
                    transform: locale === "en" ? "rotate(180deg)" : "",
                  }}
                />
              }
              onClick={() => setOpenVariantGroups(true)}
            />
          ) : (
            <Box>{orderDetails?.custom_variant_specs}</Box>
          )}
        </Box>
      </Box>

      {/* popup for variant groups */}
      <DialogCentered
        title={`${carVariantRes?.name_ar} (${carVariantRes?.name_en})`}
        open={openVariantGroups}
        setOpen={setOpenVariantGroups}
        hasCloseIcon
        content={
          <Box
            sx={{
              maxHeight: "70vh",
            }}
          >
            <div className={`${style["groups"]}`}>
              {carVariantRes?.group?.map((group) => (
                <div
                  key={group?.name}
                  onClick={() => setSelectedHeaderGroup(group)}
                  className={`${style["groups_headers"]} ${
                    selectedHeaderGroup?.name === group?.name
                      ? style["groups_headers-active"]
                      : ""
                  }`}
                >
                  {locale === "ar" ? group?.name_ar : group?.name_en}
                </div>
              ))}
            </div>
            <div className={`${style["holder"]}`}>
              {carVariantRes?.group
                ?.find((d) => d?.name === selectedHeaderGroup?.name)
                ?.specifications?.map((specification) => (
                  <div className={`${style["holder-specification"]}`}>
                    {locale === "ar"
                      ? specification?.label_ar
                      : specification?.label_en}

                    <div>{specification?.value}</div>
                  </div>
                ))}
            </div>
          </Box>
        }
      />
    </>
  );
}

export default CarDetailsOrderPricings;
