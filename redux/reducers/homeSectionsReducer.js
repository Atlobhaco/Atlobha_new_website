import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allhomeSections: [],
};

export const homeSections = createSlice({
  name: "homeSections",
  initialState,
  reducers: {
    setAllHomeSections: (state, action) => {
      state.allhomeSections = action.payload || [];
    },
  },
});

export const { setAllHomeSections } = homeSections.actions;

export default homeSections.reducer;
