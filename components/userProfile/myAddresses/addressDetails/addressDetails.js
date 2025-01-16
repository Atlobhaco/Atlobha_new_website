import useLocalization from "@/config/hooks/useLocalization";
import { Box } from "@mui/material";
import React from "react";
import styles from "./AddressDetails.module.scss";
import Image from "next/image";
import SharedTextField from "@/components/shared/SharedTextField";
import SharedBtn from "@/components/shared/SharedBtn";

function AddressDetails({
  locationInfo,
  addressNameOrCustom,
  setAddressNameOrCustom,
  manualAddress,
  setManualAddress,
  lngLatLocation,
  callAddNewAddress = () => {},
  hideSaveBtn = false,
}) {
  const { t } = useLocalization();
  const addressNames = [
    {
      name: t.home,
      type: "Home",
      cutomName: "Home",
    },
    {
      name: t.work,
      type: "Work",
      cutomName: "Work",
    },
    {
      name: t.anotherName,
      type: "custom",
      icon: "/icons/pencil.svg",
    },
  ];

  const disableSave = () => {
    if (
      !manualAddress ||
      (addressNameOrCustom?.type === "custom" &&
        addressNameOrCustom?.cutomName?.length < 3) ||
      !lngLatLocation?.lng ||
      !locationInfo
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Box>
      <Box className={styles.heading}>{t.adressDetails}</Box>
      {locationInfo && (
        <Box className={styles.locationBox}>
          <Box className={styles.locationBoxHeader}>
            {locationInfo?.country}
          </Box>
          <Box className={styles.locationBoxSubHeader}>
            {locationInfo?.formattedAddress}
            {"  "}
            {locationInfo?.route}
          </Box>
        </Box>
      )}
      <Box className={styles.locationName}>{t.locationName}</Box>
      <Box className={styles.locationsHolder}>
        {addressNames?.map((add) =>
          addressNameOrCustom?.type === "custom" && add?.type === "custom" ? (
            <Box
              key={add?.type}
              component="span"
              //   className={styles.locationsHolderActive}
              sx={{
                display: "flex",
                alignItems: "center",
                background: "rgba(255, 212, 0, 0.3) !important",
              }}
            >
              <input
                type="text"
                placeholder={t.anotherName}
                value={addressNameOrCustom?.cutomName || ""}
                onChange={(e) =>
                  setAddressNameOrCustom({
                    ...addressNameOrCustom,
                    cutomName: e.target.value,
                  })
                }
                style={{
                  border: "0.1px  solid #e6e6e6",
                  outline: "unset",
                  borderRadius: "5px",
                  background: "white",
                  color: "black",
                }}
              />
            </Box>
          ) : (
            <Box
              key={add?.type}
              onClick={() =>
                setAddressNameOrCustom({
                  ...addressNameOrCustom,
                  type: add?.type,
                  cutomName: add?.cutomName,
                })
              }
              component="span"
              className={
                addressNameOrCustom?.type === add?.type &&
                styles.locationsHolderActive
              }
            >
              {add?.name}{" "}
              {add?.icon && (
                <Image src={add?.icon} alt="pen" width={18} height={18} />
              )}
            </Box>
          )
        )}
      </Box>

      {/* {addressNameOrCustom?.type === "custom" && (
        <SharedTextField
          label={null}
          placeholder={t.anotherName}
          imgIcon={false}
          value={addressNameOrCustom?.cutomName}
          handleChange={(e) =>
            setAddressNameOrCustom({
              ...addressNameOrCustom,
              cutomName: e?.target?.value,
            })
          }
        />
      )} */}
      <Box sx={{ mb: 2 }}>
        <SharedTextField
          id="addressDetailsField"
          label={t.addressDetails}
          placeholder={t.addressDetailsHolder}
          showAstrick={true}
          imgIcon={false}
          value={manualAddress}
          handleChange={(e) => setManualAddress(e?.target?.value)}
        />
      </Box>
      {!hideSaveBtn && (
        <SharedBtn
          className="big-main-btn"
          customClass="w-100"
          text={t.common.save}
          disabled={disableSave()}
          onClick={() => callAddNewAddress()}
        />
      )}
    </Box>
  );
}

export default AddressDetails;
