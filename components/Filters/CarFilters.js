import { useAuth } from "@/config/providers/AuthProvider";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import SharedDropDown from "../shared/SharedDropDown";

import { setModels, setBrands } from "@/redux/reducers/LookupsReducer";
import { setAllCars, setDefaultCar } from "@/redux/reducers/selectedCarReducer";

import {
  useModelsQuery,
  userBrandsQuery,
} from "@/config/network/Shared/lookupsDataHelper";
import { usersVehiclesQuery } from "@/config/network/Shared/GetDataHelper";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";

function CarFilters({
  mergedShowHideFilters,
  filters,
  setFilters,
  brandId,
  setBrandId,
  modelId,
  setModelId,
  yearId,
  setYearId,
  colorHeaders,
  hasDefaultValues = true,
}) {
  const dispatch = useDispatch();
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const { user } = useAuth();
  const { selectedCar, defaultCar } = useSelector((state) => state.selectedCar);
  const { brands, models, years } = useSelector((state) => state.lookups);

  // Sync initial brand/model from filters, selectedCar, or defaultCar
  useEffect(() => {
    if (hasDefaultValues) {
      const resolvedBrandId =
        filters?.brand_id ||
        selectedCar?.brand?.id ||
        defaultCar?.brand?.id ||
        "";
      const resolvedModelId =
        filters?.model_id ||
        selectedCar?.model?.id ||
        defaultCar?.model?.id ||
        "";
      const resolvedYear =
        filters?.year || selectedCar?.year || defaultCar?.year || "";

      setBrandId(isMobile ? filters?.brand_id : resolvedBrandId);
      setModelId(isMobile ? filters?.model_id : resolvedModelId);
      setYearId(isMobile ? filters?.year : resolvedYear);
    }
  }, [selectedCar, defaultCar, hasDefaultValues]);

  //   sync only in mobile screen
  useEffect(() => {
    if ((isMobile, hasDefaultValues)) {
      const resolvedBrandId =
        filters?.brand_id ||
        selectedCar?.brand?.id ||
        defaultCar?.brand?.id ||
        "";
      const resolvedModelId =
        filters?.model_id ||
        selectedCar?.model?.id ||
        defaultCar?.model?.id ||
        "";
      const resolvedYear =
        filters?.year || selectedCar?.year || defaultCar?.year || "";

      setBrandId(isMobile ? filters?.brand_id : resolvedBrandId);
      setModelId(isMobile ? filters?.model_id : resolvedModelId);
      setYearId(isMobile ? filters?.year : resolvedYear);
    }
  }, [selectedCar, defaultCar, isMobile, filters, hasDefaultValues]);

  // API hooks
  const { refetch: callModels } = useModelsQuery({
    brandId,
    setModels,
    dispatch,
  });

  const { refetch: callBrands } = userBrandsQuery({
    setBrands,
    dispatch,
  });

  const { refetch: callUserVehicles } = usersVehiclesQuery({
    user,
    dispatch,
    setAllCars,
    setDefaultCar,
  });

  // Fetch brands and user vehicles once
  useEffect(() => {
    callBrands();
  }, []);

  // Fetch buser vehicles once
  useEffect(() => {
    if (user) {
      callBrands();
      callUserVehicles();
    }
  }, [user]);

  // Fetch models when brand changes
  useEffect(() => {
    if (brandId) {
      callModels();
    }
  }, [brandId]);

  // Handlers
  const handleBrandChange = (e) => {
    const selected = e?.target?.value;
    setBrandId(selected);
    setModelId(""); // Reset model when brand changes
    setYearId(""); // Reset year when brand changes
    setFilters((prev) => ({
      ...prev,
      brand_id: selected,
      model_id: "",
      year: "",
    }));
  };

  const handleModelChange = (e) => {
    const selected = e?.target?.value;
    setModelId(selected);
    setFilters((prev) => ({ ...prev, model_id: selected }));
  };

  const handleYearChange = (e) => {
    const selected = e?.target?.value;
    setYearId(selected);
    setFilters((prev) => ({ ...prev, year: selected }));
  };

  return (
    mergedShowHideFilters.carFilter && (
      <div>
        <h3
          style={{
            color: colorHeaders,
          }}
        >
          {t.car}
        </h3>
        <div className="row">
          <div className="col-6">
            <SharedDropDown
              id="brandSelectionForFilter"
              label={t.brand}
              value={brandId}
              handleChange={handleBrandChange}
              items={brands}
            />
          </div>

          <div className="col-6">
            <SharedDropDown
              id="modelSelectionForFilter"
              label={t.model}
              value={modelId}
              handleChange={handleModelChange}
              items={models}
              disabled={!brandId}
              hint={!brandId && t.selectBrandFirst}
            />
          </div>

          <div className="col-12 mt-3">
            <SharedDropDown
              id="yearSelectionFilters"
              handleChange={handleYearChange}
              value={yearId || ""}
              label={t.year}
              items={years}
              disabled={!brandId}
              hint={!brandId && t.selectBrandFirst}
            />
          </div>
        </div>
      </div>
    )
  );
}

export default CarFilters;
