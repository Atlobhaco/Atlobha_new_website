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
  brandName,
  setBrandName,
  modelName,
  setModelName,
  yearName,
  setYearName,
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
      filters?.brand ||
      selectedCar?.brand?.name_en ||
      defaultCar?.brand?.name_en ||
      "";
    const resolvedModelId =
      filters?.model ||
      selectedCar?.model?.name_en ||
      defaultCar?.model?.name_en ||
      "";
    const resolvedYear =
      filters?.year || selectedCar?.year || defaultCar?.year || "";

    setBrandName(isMobile ? filters?.brand : resolvedBrandId);
    setModelName(isMobile ? filters?.model : resolvedModelId);
    setYearName(isMobile ? filters?.year : resolvedYear);
  }, [selectedCar, defaultCar]);

  //   sync only in mobile screen
  useEffect(() => {
    if (isMobile) {
      const resolvedBrandId =
        filters?.brand ||
        selectedCar?.brand?.name_en ||
        defaultCar?.brand?.name_en ||
        "";
      const resolvedModelId =
        filters?.model ||
        selectedCar?.model?.name_en ||
        defaultCar?.model?.name_en ||
        "";
      const resolvedYear =
        filters?.year || selectedCar?.year || defaultCar?.year || "";

      setBrandName(isMobile ? filters?.brand : resolvedBrandId);
      setModelName(isMobile ? filters?.model : resolvedModelId);
      setYearName(isMobile ? filters?.year : resolvedYear);
    }
  }, [selectedCar, defaultCar, isMobile, filters]);

  // API hooks
  const { refetch: callModels } = useModelsQuery({
    brandId: brands?.find((d) => d?.name_en === brandName)?.id,
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
    if (brandName) {
      callModels();
    }
  }, [brandName]);

  const updateFilters = (key, value, reset = {}) => {
    setFilters((prev) => ({ ...prev, [key]: value, ...reset }));
  };

  const dropdowns = [
    {
      id: "brandSelectionForFilterCustom",
      label: t.brand,
      value: brands?.find((d) => d?.name_en === brandName)?.id,
      handleChange: (e) => {
        const val = e?.target?.value;
        setBrandName(brands?.find((d) => d?.id === val)?.name_en);
        setModelName("");
        setYearName("");
        updateFilters("brand", brands?.find((d) => d?.id === val)?.name_en, {
          model: "",
          year: "",
        });
      },
      items: brands,
    },
    {
      id: "modelSelectionForFilterCustom",
      label: t.model,
      value: models?.find((d) => d?.name_en === modelName)?.id,
      handleChange: (e) => {
        const val = e?.target?.value;
        setModelName(models?.find((d) => d?.id === val)?.name_en);
        updateFilters("model", models?.find((d) => d?.id === val)?.name_en);
      },
      items: models,
      disabled: !brandName,
      hint: !brandName && t.selectBrandFirst,
    },
    {
      id: "yearSelectionFiltersCustom",
      label: t.year,
      value: years?.find((d) => d?.name === yearName)?.id,
      handleChange: (e) => {
        const val = e?.target?.value;
        setYearName(years?.find((d) => d?.id === val)?.name);
        updateFilters("year", years?.find((d) => d?.id === val)?.name);
      },
      items: years,
      disabled: !brandName,
      hint: !brandName && t.selectBrandFirst,
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
