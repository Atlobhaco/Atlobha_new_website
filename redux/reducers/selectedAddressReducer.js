import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allAddresses: [],
  selectedAddress: {},
  defaultAddress: {},
};

const selectedAddressReducer = createSlice({
  name: "selectedAddress",
  initialState,
  reducers: {
    setAllAddresses: (state, action) => {
      state.allAddresses = action.payload?.data || [];
    },
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action?.payload?.data || {};
    },
    setDefaultAddress: (state, action) => {
      state.defaultAddress = action?.payload?.data || {};
    },
  },
});

export const { setAllAddresses, setSelectedAddress, setDefaultAddress } =
  selectedAddressReducer.actions;

export default selectedAddressReducer.reducer;
