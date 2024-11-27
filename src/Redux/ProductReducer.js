

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://mock-react-data-1.onrender.com/Products"; //http://localhost:5001/Products

export const fetchProducts = createAsyncThunk("product/fetchProducts", async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

export const addProduct = createAsyncThunk("product/addProduct", async (product) => {
  const response = await axios.post(API_URL, product);
  return response.data;
});

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, product }) => {
    const response = await axios.patch(`${API_URL}/${id}`, product);
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id; 
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (action) => { //
    action
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((product) => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const id = action.payload;
        state.products = state.products.filter((product) => product.id !== id);
      });
  },
});

export default productSlice.reducer;
