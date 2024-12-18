import { createSlice } from "@reduxjs/toolkit";
// import { getPersistedBasketItems, isAuth } from "@/config/utils";

const initialState = {
  basket: [],
  items: {},
};

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    // Action to add an item or update its quantity
    addItem(state, action) {
      const { id, product, quantity } = action.payload;
      if (state.items[id]) {
        // If the item already exists, increase the quantity
        state.items[id].cart_quantity = quantity;
      } else {
        // Add new item with quantity of 1
        state.items[id] = { ...product, cart_quantity: 1 };
      }
    },

    // Action to remove an item or decrease its quantity
    removeItem(state, action) {
      const id = action.payload;
      if (state.items[id] && state.items[id].cart_quantity > 1) {
        // Decrease quantity if more than one
        state.items[id].cart_quantity -= 1;
      } else {
        // Remove item completely if quantity is 1
        delete state.items[id];
      }
    },
    // remove item completely from first time
    removeWholeItem(state, action) {
      const id = action.payload;
      delete state.items[id];
    },

    setItems(state, action) {
      state.items = action.payload;
    },
    setBasket(state, action) {
      state.basket = [];
      state.basket.push(...action.payload);
    },
  },
});

export const { addItem, removeItem, setItems, setBasket, removeWholeItem } =
  basketSlice.actions;
export default basketSlice.reducer;
