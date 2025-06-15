import discountedPrice from "@/utils/discountedPrice";
import { createSlice } from "@reduxjs/toolkit";
import generateUniqueId from "@/utils/generateUniqueId";

const initialState = {
  items: [], // Cart items
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // unique id for product in cart
      const cartId = generateUniqueId();

      const newProduct = {
        cartId,
        ...action.payload,
        quantity: action.payload.quantity || 1,
      };
      state.items.push(newProduct);

      // Calculate total amount
      state.totalAmount = state.items.reduce(
        (total, item) =>
          total +
          discountedPrice(item.price, item.discount) * Number(item.quantity),
        0,
      );
    },

    addMultipleItemsToCart: (state, action) => {
      const newItemsArr = action.payload;

      for (let i = 0; i < action.payload.length; i++) {
        state.items.push({
          ...newItemsArr[i],
          quantity: 1,
          selectedColor: newItemsArr[i].color?.length
            ? newItemsArr[i].color[0]
            : "",
          selectedSize: newItemsArr[i].size?.length
            ? newItemsArr[i].size[0]
            : "",
        });
      }
    },

    updateQuantity: (state, action) => {
      const { cartId, quantity } = action.payload;

      const product = state.items.find((product) => product.cartId === cartId);

      if (product) {
        product.quantity = Number(quantity);

        // Update total amount for updated quantity
        state.totalAmount = state.items.reduce(
          (total, item) =>
            total +
            discountedPrice(item.price, item.discount) * Number(item.quantity),
          0,
        );
      }
    },

    removeProduct: (state, action) => {
      const cartId = action.payload;

      const rest = state.items.filter((product) => product.cartId !== cartId);

      state.items = rest;

      // Calculate total amount
      state.totalAmount = state.items.reduce(
        (total, item) =>
          total +
          discountedPrice(item.price, item.discount) * Number(item.quantity),
        0,
      );
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  addMultipleItemsToCart,
  updateQuantity,
  removeProduct,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
