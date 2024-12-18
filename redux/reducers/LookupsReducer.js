import { createSlice } from "@reduxjs/toolkit";

// Helper function to generate years as an array of objects
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: currentYear - 1990 + 1 }, (_, i) => {
    const year = 1990 + i;
    return { id: year, name: year };
  });
};

const initialState = {
  brands: [],
  models: [],
  years: generateYears(), // Years now hold objects with id and name
};

export const LookupsSlice = createSlice({
  name: "lookups",
  initialState,
  reducers: {
    setBrands: (state, action) => {
      state.brands = action.payload?.data || [];
    },
    setModels: (state, action) => {
      state.models = action.payload?.data || [];
    },
    setYears: (state, action) => {
      state.years = action.payload || [];
    },
  },
});

export const { setBrands, setModels, setYears } = LookupsSlice.actions;

export default LookupsSlice.reducer;
