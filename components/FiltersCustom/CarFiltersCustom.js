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

function CarFiltersCustom({
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
}) {
  const dispatch = useDispatch();
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const { user } = useAuth();
  const { selectedCar, defaultCar } = useSelector((state) => state.selectedCar);
  const { brands, models, years } = useSelector((state) => state.lookups);

  // Sync initial brand/model from filters, selectedCar, or defaultCar
  useEffect(() => {
    const resolvedBrandId =
      filters?.brand || selectedCar?.brand?.id || defaultCar?.brand?.id || "";
    const resolvedModelId =
      filters?.model || selectedCar?.model?.id || defaultCar?.model?.id || "";
    const resolvedYear =
      filters?.year || selectedCar?.year || defaultCar?.year || "";

    setBrandId(isMobile ? filters?.brand : resolvedBrandId);
    setModelId(isMobile ? filters?.model : resolvedModelId);
    setYearId(isMobile ? filters?.year : resolvedYear);
  }, [selectedCar, defaultCar]);

  //   sync only in mobile screen
  useEffect(() => {
    if (isMobile) {
      const resolvedBrandId =
        filters?.brand || selectedCar?.brand?.id || defaultCar?.brand?.id || "";
      const resolvedModelId =
        filters?.model || selectedCar?.model?.id || defaultCar?.model?.id || "";
      const resolvedYear =
        filters?.year || selectedCar?.year || defaultCar?.year || "";

      setBrandId(isMobile ? filters?.brand : resolvedBrandId);
      setModelId(isMobile ? filters?.model : resolvedModelId);
      setYearId(isMobile ? filters?.year : resolvedYear);
    }
  }, [selectedCar, defaultCar, isMobile, filters]);

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

  const updateFilters = (key, value, reset = {}) => {
    setFilters((prev) => ({ ...prev, [key]: value, ...reset }));
  };

  const dropdowns = [
    {
      id: "brandSelectionForFilterCustom",
      label: t.brand,
      value: brandId,
      handleChange: (e) => {
        const val = e?.target?.value;
        setBrandId(val);
        setModelId("");
        setYearId("");
        updateFilters("brand", val, { model: "", year: "" });
      },
      items: brands,
    },
    {
      id: "modelSelectionForFilterCustom",
      label: t.model,
      value: modelId,
      handleChange: (e) => {
        const val = e?.target?.value;
        setModelId(val);
        updateFilters("model", val);
      },
      items: models,
      disabled: !brandId,
      hint: !brandId && t.selectBrandFirst,
    },
    {
      id: "yearSelectionFiltersCustom",
      label: t.year,
      value: yearId || "",
      handleChange: (e) => {
        const val = e?.target?.value;
        setYearId(val);
        updateFilters("year", val);
      },
      items: years,
      disabled: !brandId,
      hint: !brandId && t.selectBrandFirst,
    },
  ];

  if (!mergedShowHideFilters?.carFilter || !user) return null;

  return (
    <div>
      <h3 style={{ color: colorHeaders }}>{t.car}</h3>
      <div className="row">
        {dropdowns.map((dd, index) => (
          <div
            key={dd.id}
            className={`col-${index < 2 ? 6 : 12} ${index === 2 ? "mt-3" : ""}`}
          >
            <SharedDropDown {...dd} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CarFiltersCustom;
