import InputAddRemove from "@/components/InputAddRemove";
import SharedAutoComplete from "@/components/SharedAutoComplete";
import SharedDropDown from "@/components/shared/SharedDropDown";
import SharedTextField from "@/components/shared/SharedTextField";
import useLocalization from "@/config/hooks/useLocalization";
import { Autocomplete, Box, TextField } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";

function AddPartDialogContent() {
  const { t } = useLocalization();
  const { brands, models, years } = useSelector((state) => state.lookups);
  const [searchFor, setSearchFor] = useState("");

  const header = {
    fontSize: "24px",
    fontWeight: "700",
    color: "black",
    mb: 2,
  };
  const subTitle = {
    fontSize: "20px",
    fontWeight: "500",
    color: "#374151",
    mb: 2,
  };

  const handleChange = (e, newValue) => {
    console.log("newValue", newValue);
    setSearchFor(newValue?.id || "");
  };

  console.log("searchValue", searchFor);
  const top100Films = [
    { label: "The Shawshank Redemption", year: 1994 },
    { label: "The Godfather", year: 1972 },
    { label: "The Godfather: Part II", year: 1974 },
  ];
  return (
    <Box>
      <Box sx={header}>{t.addPartForPricing}</Box>
      <Box sx={subTitle}>{t.nameNumPrice}</Box>
      <Box>
        <Box sx={{ maxWidth: "80%" }}>
          <SharedAutoComplete
            label={null}
            handleChange={handleChange}
            error={false}
            value={searchFor || ""}
            showAstrick={false}
            items={brands}
          />
        </Box>
        <InputAddRemove />
      </Box>
    </Box>
  );
}

export default AddPartDialogContent;
