import {
  BATTERIES_ATTRIBUTES,
  OIL_ATTRIBUTES,
  TIRES_ATTRIBUTES,
  VALUES,
} from "@/config/endPoints/endPoints";
import useCustomQuery from "@/config/network/Apiconfig";
import React, { useState } from "react";
import SharedDropDown from "../shared/SharedDropDown";
import useLocalization from "@/config/hooks/useLocalization";
import { CircularProgress } from "@mui/material";

function ConditionalAttributesFilter({
  mergedShowHideFilters,
  filters,
  allCategories,
  setFilters,
  colorHeaders,
}) {
  const { t } = useLocalization();
  const [attributes, setAttributes] = useState([]);

  const urlDependOnCatId = () => {
    switch (filters?.category_id?.toString()) {
      case "11":
        return `${OIL_ATTRIBUTES}${VALUES}`;
      case "7":
        return `${TIRES_ATTRIBUTES}${VALUES}`;
      case "2":
        return `${BATTERIES_ATTRIBUTES}${VALUES}`;
      default:
        break;
    }
  };
  const headerForattribute = () =>
    allCategories?.find((d) => +d.id === +filters?.category_id)?.name ?? "-";

  const { isFetching: fetchAttributes } = useCustomQuery({
    name: ["conditionalAttributes", filters?.category_id],
    url: urlDependOnCatId(),
    refetchOnWindowFocus: false,
    enabled: filters?.category_id ? true : false,
    select: (res) => res?.data?.data,
    onSuccess: (res) => setAttributes(res),
  });

  const handleAttributeChange = (key, event) => {
    setFilters((prev) => ({
      ...prev,
      conditionalAttributes: {
        ...prev.conditionalAttributes,
        [key]: event?.target?.value,
      },
    }));
  };

  return (
    mergedShowHideFilters?.conditionsAttributes && (
      <div>
        <h3
          style={{
            color: colorHeaders,
            marginTop: "16px",
          }}
        >
          {headerForattribute()}
        </h3>
        <div className="row">
          {fetchAttributes && (
            <div className="col-12">
              <CircularProgress
                sx={{
                  color: "#FFD400",
                }}
                size={30}
              />
            </div>
          )}
          {attributes?.map((attr) => (
            <div
              className={`${
                attributes?.length > 1 ? "col-md-6 col-12" : "col-12"
              }`}
            >
              <SharedDropDown
                key={attr.filter_key}
                id={attr.filter_key}
                label={attr.label}
                value={filters?.conditionalAttributes?.[attr.filter_key] || ""}
                handleChange={(event) =>
                  handleAttributeChange(attr.filter_key, event)
                }
                items={attr.filter_values.map((val) => ({
                  label: val,
                  value: val,
                  name: val,
                  id: val,
                }))}
              />
            </div>
          ))}
        </div>
      </div>
    )
  );
}

export default ConditionalAttributesFilter;
