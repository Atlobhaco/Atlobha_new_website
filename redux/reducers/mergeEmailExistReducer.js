import { createSlice } from "@reduxjs/toolkit";

const mergeEmailExist = createSlice({
  name: "mergeEmailExist",
  initialState: { openMergeEmail: false, emailforMerge: false },
  reducers: {
    toggleMergeEmail: (state, action) => {
      state.openMergeEmail = action.payload ?? !state.openMergeEmail; // toggle or set explicitly
    },
    setEmailForMerge: (state, action) => {
      state.emailforMerge = action.payload;
    },
  },
});

export const { toggleMergeEmail, setEmailForMerge } = mergeEmailExist.actions;
export default mergeEmailExist.reducer;
