import React, { useState } from "react";
import style from "./carPricing.module.scss";
import { Box, CircularProgress } from "@mui/material";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import useLocalization from "@/config/hooks/useLocalization";
import Image from "next/image";
import DialogCentered from "../../components/DialogCentered";
import SharedBtn from "../../components/shared/SharedBtn";

function SpecificationAgencySelections({
  isFetching,
  specificationSelection,
  selectedVariant,
  setSelectedVariant,
}) {
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();
  const [openVariantGroups, setOpenVariantGroups] = useState(false);
  const [selectedHeaderGroup, setSelectedHeaderGroup] = useState(null);

  return (
    <>
      <div className="d-flex flex-wrap gap-2">
        {isFetching ? (
          <CircularProgress
            sx={{
              color: "#FFD400",
            }}
            size={isMobile ? 15 : 25}
          />
        ) : !specificationSelection?.length ? (
          t.noResultsFound
        ) : (
          specificationSelection?.map((variant) => (
            <div
              key={variant?.name}
              className={`${style["specify"]} ${
                selectedVariant?.variant === variant?.variant &&
                style["active-specify"]
              }`}
              onClick={() => {
                setSelectedVariant(variant);
                setOpenVariantGroups(true);
                setSelectedHeaderGroup(variant?.group[0]);
              }}
            >
              {variant?.name_ar} ({variant?.name_en})
              <Image
                alt="img"
                src={"/icons/arrow-left-sm.svg"}
                width={10}
                height={10}
                loading="lazy"
                style={{
                  transform:
                    locale === "en" ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </div>
          ))
        )}
      </div>

      {/* popup for variant groups */}
      <DialogCentered
        title={`${selectedVariant?.name_ar} (${selectedVariant?.name_en})`}
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
              {selectedVariant?.group?.map((group) => (
                <div
                  key={group?.name}
                  onClick={() => setSelectedHeaderGroup(group)}
                  className={`${style["groups_headers"]} ${
                    selectedHeaderGroup?.name === group?.name
                      ? style["groups_headers-active"]
                      : ""
                  }`}
                >
                  {group?.name}
                </div>
              ))}
            </div>
            <div className={`${style["holder"]}`}>
              {selectedVariant?.group
                ?.find((d) => d?.name === selectedHeaderGroup?.name)
                ?.specifications?.map((specification) => (
                  <div className={`${style["holder-specification"]}`}>
                    {specification?.label}
                    <div>{specification?.value}</div>
                  </div>
                ))}
            </div>
          </Box>
        }
        renderCustomBtns={
          <div className="d-flex justify-content-center w-100">
            <SharedBtn
              onClick={() => {
                setOpenVariantGroups(false);
              }}
              text="confirmSelection"
              className="big-main-btn"
              customClass={`my-3 ${isMobile ? "w-100" : "w-50"}`}
            />
          </div>
        }
      />
    </>
  );
}

export default SpecificationAgencySelections;
