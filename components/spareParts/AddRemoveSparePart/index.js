import { Box } from "@mui/material";
import React from "react";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import InputAddRemove from "@/components/InputAddRemove";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedSparePart } from "@/redux/reducers/addSparePartsReducer";

function AddRemoveSparePart({ data }) {
  const { isMobile } = useScreenSize();
  const dispatch = useDispatch();
  const selectedParts = useSelector(
    (state) => state.addSpareParts.selectedParts
  );
  const selectedSparePart = selectedParts?.find(
    (part) => part?.id === data?.id
  ) || { quantity: 0 };

  const updateSparePart = (quantity, extra = {}) => {
    dispatch(
      setSelectedSparePart({
        data: { ...selectedSparePart, quantity, ...extra },
      })
    );
  };

  const handleChangeInput = (e) => updateSparePart(+e.target.value);
  const handleBlurInput = (e) => {
    if (!+e.target.value) updateSparePart(0, { name: "", delete: true });
  };
  const deleteMinus = () => {
    const newQuantity = Math.max(1, +selectedSparePart?.quantity - 1);
    updateSparePart(newQuantity, { name: newQuantity === 1 ? "" : null });
  };
  const increaseValue = () => updateSparePart(+selectedSparePart?.quantity + 1);

  return (
    <Box>
      <Box
        sx={{
          marginBottom: "8px",
          fontSize: isMobile ? "14px" : "16px",
          fontWeight: 500,
        }}
      >
        {data?.name}
      </Box>
      <Box sx={{ width: isMobile ? "90px" : "115px" }}>
        <InputAddRemove
          value={data}
          handleChange={handleChangeInput}
          handleBlur={handleBlurInput}
          actionClickrightIcon={deleteMinus}
          actionClickIcon={increaseValue}
        />
      </Box>
    </Box>
  );
}

export default AddRemoveSparePart;
