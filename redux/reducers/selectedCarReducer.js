import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allCars: [],
  selectedCar: {},
  defaultCar: {},
};

export const selectedCarSlice = createSlice({
  name: "selectedCarSlice",
  initialState,
  reducers: {
    setAllCars: (state, action) => {
      state.allCars = action.payload?.data || [];
    },
    setSelectedCar: (state, action) => {
      state.selectedCar = action?.payload?.data || {};
    },
    setDefaultCar: (state, action) => {
      state.defaultCar = action?.payload?.data || {};
    },
  },
});

export const { setAllCars, setSelectedCar, setDefaultCar } =
  selectedCarSlice.actions;

export default selectedCarSlice.reducer;
