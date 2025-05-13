import { MEDIA, ORDERS, SPARE_PARTS } from "@/config/endPoints/endPoints";
import { isAuth } from "@/config/hooks/isAuth";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  allSpareParts: [],
  selectedParts: [],
  promoCode: null,
  isLoading: false,
  error: null,
  voucherCode: null,
  allPromoCodeData: null,
  allvoucherCodeData: null,
};

// Thunk to fetch data from the endpoint
export const fetchPartDetails = createAsyncThunk(
  "addSparePartsReducer/fetchPartDetails",
  async (part, { rejectWithValue }) => {
    try {
      if (part.imgFile && isAuth()) {
        const formData = new FormData();
        formData.append("media[0]", part.imgFile);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}${SPARE_PARTS}${ORDERS}${MEDIA}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage?.getItem("access_token")}`,
              "x-api-key": "w123",
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return { ...part, imgPathForBe: response.data?.data[0]?.image };
      } else {
        return { ...part, imgPathForBe: null };
      }
      // Merge incoming part with response data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addSparePartsReducer = createSlice({
  name: "addSparePartsReducer",
  initialState,
  reducers: {
    setAllSpareParts: (state, action) => {
      state.allSpareParts = action.payload?.data || [];
    },
    setPromoCodeForSpareParts: (state, action) => {
      state.promoCode = action.payload?.data || null;
    },
    setPromoCodeAllData: (state, action) => {
      state.allPromoCodeData = action.payload?.data || null;
    },
    setVoucher: (state, action) => {
      state.voucherCode = action.payload?.data || null;
    },
    setVoucherAllData: (state, action) => {
      state.allvoucherCodeData = action.payload?.data || null;
    },
    addOrUpdateSparePart: (state, action) => {
      const incomingPart = action.payload;

      const existingIndex = state.selectedParts.findIndex(
        (part) => part.id === incomingPart.id
      );

      if (incomingPart.delete === true) {
        // Force delete for the part
        if (existingIndex !== -1) {
          state.selectedParts.splice(existingIndex, 1);
        }
      } else if (existingIndex !== -1) {
        // Update quantity if the part already exists
        state.selectedParts[existingIndex].quantity = incomingPart.quantity;
      } else {
        // Add the new part
        state.selectedParts.push(incomingPart);
      }
    },
    clearSpareParts: (state, action) => {
      state.selectedParts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPartDetails.fulfilled, (state, action) => {
        const incomingPart = action.payload;

        const existingIndex = state.selectedParts.findIndex(
          (part) => part.id === incomingPart.id
        );

        if (existingIndex === -1) {
          // Only add if it doesn't exist already
          state.selectedParts.push(incomingPart);
        }

        state.isLoading = false;
      })
      .addCase(fetchPartDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "An error occurred.";
      });
  },
});

export const {
  setAllSpareParts,
  setPromoCodeForSpareParts,
  addOrUpdateSparePart,
  clearSpareParts,
  setVoucher,
  setPromoCodeAllData,
  setVoucherAllData,
} = addSparePartsReducer.actions;

export default addSparePartsReducer.reducer;
