import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allsections: [],
  userDataProfile: {},
};

export const quickSectionsProfile = createSlice({
  name: "quickSectionsProfile",
  initialState,
  reducers: {
    setAllSections: (state, action) => {
      state.allsections = action.payload?.data || [];
    },
    setUserData: (state, action) => {
      state.userDataProfile = action.payload?.data || [];
    },
  },
});

export const { setAllSections, setUserData } = quickSectionsProfile.actions;

export default quickSectionsProfile.reducer;
