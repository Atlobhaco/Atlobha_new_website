import useLocalization from "@/config/hooks/useLocalization";
import Image from "next/image";
import React, { useEffect } from "react";
import style from "./carPricing.module.scss";
import SharedDropDown from "../../components/shared/SharedDropDown";
import { useDispatch, useSelector } from "react-redux";
import {
  useModelsQuery,
  userBrandsQuery,
} from "@/config/network/Shared/lookupsDataHelper";
import { setModels, setBrands } from "@/redux/reducers/LookupsReducer";

function SelectCar({ selectedCar, setSelectedCar }) {
  const { t } = useLocalization();
  const dispatch = useDispatch();
  const { brands, models, years } = useSelector((state) => state.lookups);

  // Fetch brands
  useEffect(() => {
    callBrands();
  }, []);

  // API hooks
  const { refetch: callModels } = useModelsQuery({
    brandId: selectedCar?.brandDetails?.id,
    setModels,
    dispatch,
    queryParams: {
      subscribed_to_vehicle_pricing: 1,
    },
  });

  const { refetch: callBrands } = userBrandsQuery({
    setBrands,
    dispatch,
    queryParams: {
      subscribed_to_vehicle_pricing: 1,
    },
  });

  return (
    <div className={`${style["border-bottom"]} py-4`}>
      <div className={`d-flex align-items-center gap-3 `}>
        <Image src="/icons/car-active.svg" alt="car" width={25} height={25} />
        <div className={`${style["heading"]}`}>{t.car}</div>
      </div>
      <div className="row">
        <div className="col-6 mt-2">
          <SharedDropDown
            id="brandSelectionCarPricing"
            handleChange={(e) => {
              setSelectedCar({
                ...selectedCar,
                brandDetails: brands?.find((b) => +b?.id === +e?.target?.value),
                modelDetails: "",
              });
            }}
            value={selectedCar?.brandDetails?.id || ""}
            label={t.brand}
            showAstrick
            items={brands}
          />
        </div>

        <div className="col-6 mt-2">
          <SharedDropDown
            id="modelSelectionCarPricing"
            handleChange={(e) => {
              setSelectedCar({
                ...selectedCar,
                modelDetails: models?.find((b) => +b?.id === +e?.target?.value),
              });
            }}
            name="model"
            value={selectedCar?.modelDetails?.id || ""}
            label={t.model}
            showAstrick
            items={models}
            disabled={!selectedCar?.brandDetails?.id}
            hint={!selectedCar?.brandDetails?.id && t.selectBrandFirst}
          />
        </div>

        <div className="col-6 mt-2">
          <SharedDropDown
            id="yearSelectionCarPricing"
            handleChange={(e) => {
              setSelectedCar({
                ...selectedCar,
                year: e?.target?.value,
              });
            }}
            name="year"
            value={selectedCar?.year || ""}
            label={t.year}
            showAstrick
            items={years}
          />
        </div>
      </div>
    </div>
  );
}

export default SelectCar;
