import { createSlice } from "@reduxjs/toolkit";

// Helper function to generate years as an array of objects
const generateYears = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1 → 12

  // Add next year only if month is Sep (9) or later
  const maxYear = currentMonth >= 9 ? currentYear + 1 : currentYear;

  return Array.from({ length: maxYear - 1990 + 1 }, (_, i) => {
    const year = 1990 + i;
    return { id: year, name: year };
  }).reverse();
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
