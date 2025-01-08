import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allsections: [],
};

export const quickSectionsProfile = createSlice({
  name: "quickSectionsProfile",
  initialState,
  reducers: {
    setAllSections: (state, action) => {
      state.allsections = action.payload?.data || [];
    },
  },
});

export const { setAllSections } = quickSectionsProfile.actions;

export default quickSectionsProfile.reducer;
