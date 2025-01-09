import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allGroups: [],
};

export const appGroups = createSlice({
  name: "appGroups",
  initialState,
  reducers: {
    setAllGroups: (state, action) => {
      state.allGroups = action.payload || [];
    },
  },
});

export const { setAllGroups } = appGroups.actions;

export default appGroups.reducer;
