import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allhomeSections: [],
  sectionsSeo: [],
};

export const homeSections = createSlice({
  name: "homeSections",
  initialState,
  reducers: {
    setAllHomeSections: (state, action) => {
      state.allhomeSections = action.payload || [];
    },
    setSectionsSeo: (state, action) => {
      state.sectionsSeo = action.payload || [];
    },
  },
});

export const { setAllHomeSections, setSectionsSeo } = homeSections.actions;

export default homeSections.reducer;
