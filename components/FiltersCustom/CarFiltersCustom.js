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
  colorHeaders,
  returnPageIntoOriginal,
}) {
  const { isMobile } = useScreenSize();
  const dispatch = useDispatch();
  const { t } = useLocalization();
  const { user } = useAuth();
  const { brands, models, years } = useSelector((state) => state.lookups);

  // API hooks
  const { refetch: callModels } = useModelsQuery({
    brandId: filters?.brand,
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
    if (filters?.brand?.length && brands?.length) {
      callModels();
    }
  }, [brands?.length]);

  const updateFilters = (key, value, reset = {}) => {
    setFilters((prev) => ({ ...prev, [key]: value, ...reset }));
    if (!isMobile) {
      returnPageIntoOriginal();
    }
  };

  const dropdowns = [
    {
      id: "brandSelectionForFilterCustom",
      label: t.brand,
      value: filters?.brand,
      handleChange: (e) => {
        const val = e?.target?.value;
        updateFilters("brand", val, {
          model: "",
          year: "",
        });
      },
      items: brands,
    },
    {
      id: "modelSelectionForFilterCustom",
      label: t.model,
      value: filters?.model,
      handleChange: (e) => {
        const val = e?.target?.value;
        updateFilters("model", val);
      },
      items: models,
      disabled: !filters?.brand,
      hint: !filters?.brand && t.selectBrandFirst,
    },
    {
      id: "yearSelectionFiltersCustom",
      label: t.year,
      value: filters?.year,
      handleChange: (e) => {
        const val = e?.target?.value;
        updateFilters("year", val);
      },
      items: years,
      disabled: !filters?.brand,
      hint: !filters?.brand && t.selectBrandFirst,
    },
  ];

  if (!mergedShowHideFilters?.carFilter ) return null;

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
