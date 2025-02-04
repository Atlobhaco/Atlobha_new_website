import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedPaymentMethod: {},
};

export const selectedPaymentMethod = createSlice({
  name: "selectedPaymentMethod",
  initialState,
  reducers: {
    setSelectedPayment: (state, action) => {
      state.selectedPaymentMethod = action?.payload?.data || {};
    },
  },
});

export const { setSelectedPayment } = selectedPaymentMethod.actions;

export default selectedPaymentMethod.reducer;
