import React from "react";
import style from "./carPricing.module.scss";
import useLocalization from "@/config/hooks/useLocalization";
import Image from "next/image";
import SharedCheckbox from "../../components/shared/SharedCheckbox";
import ErrorIcon from "@mui/icons-material/Error";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import useCustomQuery from "@/config/network/Apiconfig";
import { MODELS, SPECS } from "@/config/endPoints/endPoints";
import SpecificationAgencySelections from "./SpecificationAgencySelections";
import SpecificationImportSelection from "./SpecificationImportSelection";

function CarSpecification({
  selectedSpecify,
  setSelectedSpecify,
  selectedCar,
  selectedVariant,
  setSelectedVariant,
  importedCarSpecification,
  setImportedCarSpecification,
}) {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();

  const { isFetching, data: specificationSelection } = useCustomQuery({
    name: ["list-specs", selectedCar?.modelDetails?.id],
    url: `${MODELS}/${selectedCar?.modelDetails?.id}${SPECS}`,
    refetchOnWindowFocus: false,
    enabled: selectedCar?.modelDetails?.id ? true : false,
    select: (res) => res?.data?.data,
  });

  const specificationsForCar = [
    {
      title: t.carFromAgency,
      subTitle: t.carAgencyDescribe,
      type: "agency",
    },
    {
      title: t.carImported,
      subTitle: t.carImportedDescribe,
      type: "Imported",
    },
  ];

  return (
    <div className={`${style["border-bottom"]} py-4`}>
      <div className={`d-flex align-items-center gap-3 `}>
        <Image
          src="/icons/brakes-yellow.svg"
          alt="car-brakes"
          width={25}
          height={25}
        />
        <div className={`d-flex flex-column`}>
          <div className={`${style["heading"]}`}>{t.specifications}</div>
          <div className={`${style["sub-heading"]}`}>
            {t.chooseSpecification}
          </div>
        </div>
      </div>
      <div className="row my-2">
        {specificationsForCar?.map((specify) => (
          <div className="col-md-6 mb-1" key={specify?.type}>
            <div
              className={`${style["specify-box"]} ${
                selectedSpecify === specify?.type && style["active-specify"]
              }`}
              onClick={() => {
                setSelectedSpecify(specify?.type);
                setSelectedVariant(null);
              }}
            >
              <div className={`${style["specify-box_check"]}`}>
                <SharedCheckbox
                  selectedId={selectedSpecify}
                  handleCheckboxChange={(data) => {
                    setSelectedSpecify(data?.id);
                    setSelectedVariant(null);
                  }}
                  data={{ id: specify?.type }}
                />
              </div>
              <div className={`${style["specify-box_labels"]}`}>
                <div className={`${style["specify-box_labels-title"]}`}>
                  {specify?.title}
                </div>
                <div className={`${style["specify-box_labels-sub-title"]}`}>
                  {specify?.subTitle}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!selectedSpecify || !selectedCar?.modelDetails?.id ? (
        <div className={`${style["no-select-specify"]}`}>
          <ErrorIcon
            sx={{
              color: "#E06E0E",
              width: isMobile ? 15 : "auto",
            }}
          />
          {t.pleaseChooseCarspecify}
        </div>
      ) : selectedSpecify === "agency" ? (
        <>
          <div className={`${style["choose-specify"]}`}>{t.chooseSpecify}</div>
          <SpecificationAgencySelections
            specificationSelection={specificationSelection}
            isFetching={isFetching}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
          />
        </>
      ) : (
        <>
          <SpecificationImportSelection
            importedCarSpecification={importedCarSpecification}
            setImportedCarSpecification={setImportedCarSpecification}
          />
        </>
      )}
    </div>
  );
}

export default CarSpecification;
