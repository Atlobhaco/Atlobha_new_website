import { CART } from "@/config/endPoints/endPoints";
import { isAuth } from "@/config/hooks/isAuth";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  addRemoveFromCartEngage,
  latestUpdatedCart,
} from "../../constants/helpers";

const BASE_URL = CART;
const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}${BASE_URL}`;
const API_KEY = "w123";

// ➤ Reusable API Request Handler
const requestHandler = async (method, endpoint, data = {}) => {
  const token = localStorage?.getItem("access_token");
  return axios({
    method,
    url: `${API_URL}${endpoint}`,
    data,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "x-api-key": API_KEY,
      "Accept-Language": document.documentElement.lang || "ar",
    },
  });
};

const validateExpressDelivery = async (basket, addressId) => {
  return requestHandler("post", "/validate-express-delivery", {
    products: basket,
    address_id: addressId,
  });
};

// export const fetchCartAsync = createAsyncThunk(
//   "basket/fetchCartAsync",
//   async (_, { rejectWithValue }) => {
//     if (isAuth()) {
//       try {
//         const response = await requestHandler("get", "");
//         const data = response.data;
//         latestUpdatedCart(data?.data);
//         return data;
//       } catch (error) {
//         return rejectWithValue(error.response?.data || "Failed to fetch cart");
//       }
//     } else {
//       return rejectWithValue("No logged in user"); // 🛠️ also fix this error reference
//     }
//   }
// );

export const fetchCartAsync = createAsyncThunk(
  "basket/fetchCartAsync",
  async (_, { getState, rejectWithValue }) => {
    if (!isAuth()) {
      return rejectWithValue("No logged in user");
    }

    try {
      // 1️⃣ Fetch cart (source of truth)
      const response = await requestHandler("get", "");
      const cartItems = response.data?.data || [];

      // 2️⃣ Get selected address
      const state = getState();
      const addressId =
        state?.selectedAddress?.defaultAddress?.id ||
        state?.selectedAddress?.selectedAddress?.id;

      let updatedCart = cartItems;

      // 3️⃣ Call express validation & REPLACE labels
      if (addressId && cartItems.length) {
        const validateResponse = await validateExpressDelivery(
          cartItems.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
          })),
          addressId
        );
        const expressProducts = validateResponse?.data?.data?.products || [];

        // 🔑 Build lookup map
        const expressMap = new Map(
          expressProducts.map((p) => [p.product_id, p.labels || []])
        );
        updatedCart = cartItems.map((item) => ({
          ...item,
          product: {
            ...item.product,
            // ✅ REPLACE labels from express response
            // labels: expressMap.get(item.product.id) || [],
            labels: item?.product?.labels || [],
          },
        }));
      }

      latestUpdatedCart(updatedCart);

      return {
        ...response.data,
        data: updatedCart,
      };
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to fetch cart");
    }
  }
);

// ➤ Sync from Local Storage
export const syncFromLocalStorage = createAsyncThunk(
  "basket/syncFromLocalStorage",
  async (payload, { dispatch, getState, rejectWithValue }) => {
    try {
      const state = getState();
      const newProducts = (Array.isArray(payload) ? payload : [payload]).map(
        ({ product, ...rest }) => rest
      );

      await requestHandler("post", "", { products: newProducts });

      dispatch(fetchCartAsync());
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to sync items");
    }
  }
);

// ➤ Add Items
export const addItemAsync = createAsyncThunk(
  "basket/addItemAsync",
  async (payload, { dispatch, getState, rejectWithValue }) => {
    if (isAuth()) {
      try {
        const state = getState();
        const currentBasket = state.basket.basket || [];

        const newProducts = (Array.isArray(payload) ? payload : [payload]).map(
          ({ product, ...rest }) => rest
        );

        const products = [
          ...currentBasket.map((item) => ({
            product_id: item?.product?.id || item?.product_id,
            quantity: item?.quantity,
          })),
          ...newProducts,
        ];

        await requestHandler("post", "", { products });
        dispatch(fetchCartAsync());
        addRemoveFromCartEngage({
          prod: payload[0]?.product || payload?.product,
          action: "increment",
          productInsideBasket: {
            quantity: payload?.quantity - 1,
          },
        });
      } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to add items");
      }
    } else {
      const newItems = Array.isArray(payload) ? payload : [payload];
      const state = getState();
      const currentBasket = {};

      state.basket.basket.forEach((item) => {
        currentBasket[item.product_id] = { ...item };
      });

      newItems.forEach(({ product_id, product, quantity }) => {
        currentBasket[product_id] = { product_id, product, quantity };
      });

      dispatch(updateBasket(Object.values(currentBasket)));
      dispatch(fetchCartAsync());
    }
  }
);

// ➤ Update Item Quantity
export const updateItemQuantityAsync = createAsyncThunk(
  "basket/updateItemQuantityAsync",
  async (
    { product_id, actionType },
    { dispatch, getState, rejectWithValue }
  ) => {
    if (isAuth()) {
      try {
        const state = getState();
        const allProdDetailsBeforeUpdate = state.basket?.basket?.find(
          (d) => d?.product_id === product_id
        );
        addRemoveFromCartEngage({
          prod: allProdDetailsBeforeUpdate?.product,
          action: actionType,
          productInsideBasket: allProdDetailsBeforeUpdate,
        });

        await requestHandler("put", `/${actionType}`, { product_id });
        dispatch(fetchCartAsync());
      } catch (error) {
        return rejectWithValue(
          error.response?.data || `Failed to ${actionType} item`
        );
      }
    } else {
      const state = getState();
      const currentBasket = {};

      state.basket.basket.forEach((item) => {
        if (item.product_id) {
          currentBasket[item.product_id] = { ...item };
        }
      });

      if (!product_id) {
        console.error("Invalid product_id:", product_id);
        return;
      }

      const quantityChange = actionType === "increment" ? 1 : -1;

      if (currentBasket[product_id]) {
        currentBasket[product_id] = {
          ...currentBasket[product_id],
          quantity: Math.max(
            1,
            currentBasket[product_id].quantity + quantityChange
          ),
        };
      }

      dispatch(updateBasket(Object.values(currentBasket)));
      dispatch(fetchCartAsync());
    }
  }
);

// ➤ Delete Item
export const deleteItemAsync = createAsyncThunk(
  "basket/deleteItemAsync",
  async ({ product_id }, { dispatch, getState, rejectWithValue }) => {
    if (isAuth()) {
      try {
        const state = getState();
        await requestHandler("delete", "/delete", { product_id });
        dispatch(fetchCartAsync());

        const allProdDetailsBeforeUpdate = state.basket?.basket?.find(
          (d) => d?.product_id === product_id
        );

        addRemoveFromCartEngage({
          prod: allProdDetailsBeforeUpdate?.product,
          action: "delete",
          productInsideBasket: allProdDetailsBeforeUpdate,
        });
      } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to delete item");
      }
    } else {
      const state = getState();
      const updatedBasket = state.basket.basket.filter(
        (item) => item?.product_id !== product_id
      );
      dispatch(updateBasket(Object.values(updatedBasket)));
      dispatch(fetchCartAsync());
    }
  }
);

// ➤ Initial State
const initialState = {
  basket: [],
  items: {},
  error: null,
  loadingCart: false, // Added loading state
};

// ➤ Basket Slice
const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    updateBasket(state, action) {
      if (!isAuth()) {
        localStorage.setItem("basket", JSON.stringify(action.payload));
      }
      state.basket = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCartAsync.pending, (state) => {
        state.loadingCart = true;
      })
      .addCase(fetchCartAsync.fulfilled, (state, action) => {
        state.loadingCart = false;
        state.basket =
          action.payload?.data?.map((prod) => ({
            product_id: prod?.product?.id,
            ...prod,
          })) || [];
      })
      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.loadingCart = false;
        state.error = action.payload;
      })

      // Sync from Local Storage
      .addCase(syncFromLocalStorage.pending, (state) => {
        state.loadingCart = true;
      })
      .addCase(syncFromLocalStorage.fulfilled, (state) => {
        // state.loadingCart = false;
      })
      .addCase(syncFromLocalStorage.rejected, (state, action) => {
        // state.loadingCart = false;
        state.error = action.payload;
      })

      // Add Item
      .addCase(addItemAsync.pending, (state) => {
        state.loadingCart = true;
      })
      .addCase(addItemAsync.fulfilled, (state) => {
        // state.loadingCart = false;
      })
      .addCase(addItemAsync.rejected, (state, action) => {
        // state.loadingCart = false;
        state.error = action.payload;
      })

      // Delete Item
      .addCase(deleteItemAsync.pending, (state) => {
        state.loadingCart = true;
      })
      .addCase(deleteItemAsync.fulfilled, (state) => {
        // state.loadingCart = false;
      })
      .addCase(deleteItemAsync.rejected, (state, action) => {
        // state.loadingCart = false;
        state.error = action.payload;
      })

      // Update Quantity
      .addCase(updateItemQuantityAsync.pending, (state) => {
        state.loadingCart = true;
      })
      .addCase(updateItemQuantityAsync.fulfilled, (state) => {
        // state.loadingCart = false;
      })
      .addCase(updateItemQuantityAsync.rejected, (state, action) => {
        // state.loadingCart = false;
        state.error = action.payload;
      });
  },
});

// ➤ Exports
export const { updateBasket } = basketSlice.actions;
export default basketSlice.reducer;
