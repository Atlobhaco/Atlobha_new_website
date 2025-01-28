import { Box } from "@mui/material";
import React from "react";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import InputAddRemove from "@/components/InputAddRemove";
import { useDispatch, useSelector } from "react-redux";
import { addOrUpdateSparePart } from "@/redux/reducers/addSparePartsReducer";
import { toast } from "react-toastify";
import useLocalization from "@/config/hooks/useLocalization";

function AddRemoveSparePart({ data, insideOrder = false }) {
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();
  const dispatch = useDispatch();
  const selectedParts = useSelector(
    (state) => state.addSpareParts.selectedParts
  );
  const selectedSparePart = selectedParts?.find(
    (part) => part?.id === data?.id
  ) || { quantity: 0 };


  const updateSparePart = (quantity, extra = {}) => {
    // can not delete the laste item from the order
    if (insideOrder && selectedParts?.length === 1 && +quantity === 0) {
      toast.error(t.canNotDeletePart);
      return null;
    }
    dispatch(
      addOrUpdateSparePart({ ...selectedSparePart, quantity, ...extra })
    );
  };

  const handleChangeInput = (e) => updateSparePart(+e.target.value);
  const handleBlurInput = (e) => {
    if (!+e.target.value) updateSparePart(0, { name: "", delete: true });
  };
  const deleteMinus = () => {
    const newQuantity = +selectedSparePart?.quantity - 1;
    updateSparePart(newQuantity, {
      name: +newQuantity === 1 ? "" : null,
      delete: +newQuantity === 0 ? true : false,
    });
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
