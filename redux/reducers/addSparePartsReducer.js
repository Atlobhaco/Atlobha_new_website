import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allSpareParts: [],
  selectedParts: [],
};

export const addSparePartsReducer = createSlice({
  name: "addSparePartsReducer",
  initialState,
  reducers: {
    setAllSpareParts: (state, action) => {
      state.allSpareParts = action.payload?.data || [];
    },
    setSelectedSparePart: (state, action) => {
      const incomingPart = action.payload?.data;
      if (!incomingPart?.id) return; // Ensure the incoming part has an ID

      const existingIndex = state.selectedParts.findIndex(
        (part) => part.id === incomingPart.id
      );

      if (incomingPart.delete) {
        // force delete for the part
        if (existingIndex !== -1) {
          state.selectedParts.splice(existingIndex, 1);
        }
      } else if (existingIndex !== -1) {
        // Update quantity if the part already exists
        state.selectedParts[existingIndex].quantity = incomingPart.quantity;
      } else {
        // Add the new part
        state.selectedParts.push(incomingPart);
      }
    },
  },
});

export const { setAllSpareParts, setSelectedSparePart } =
  addSparePartsReducer.actions;

export default addSparePartsReducer.reducer;
