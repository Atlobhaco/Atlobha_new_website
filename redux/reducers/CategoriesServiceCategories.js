import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allCategories: [],
  allServiceCategories: [],
};

export const categoriesServiceCategories = createSlice({
  name: "categoriesServiceCategories",
  initialState,
  reducers: {
    setAllCategories: (state, action) => {
      state.allCategories = action.payload || [];
    },
    setAllServiceCategories: (state, action) => {
      state.allServiceCategories = action.payload || [];
    },
  },
});

export const { setAllCategories, setAllServiceCategories } =
  categoriesServiceCategories.actions;

export default categoriesServiceCategories.reducer;
