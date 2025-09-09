import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getCatalogProduct } from "@/lib/product";

// Define types for our state
export interface TypeProduct {
  id: number;
  name: string;
  catelog: string;
  qPcs: number;
  price: number;
  cut: number;
  type: string;
  description: string;
  images: string[];
  set?: number;
  remark?: string;
}

// Define response type from API
export interface TabcoResponse {
  appName: string;
  copyRightText: string;
  logoUrl: string;
  message: string;
  products: TypeProduct[];
  salesmanId: number;
  salesmanMobileNo: string;
  salesmanName: string;
  success: boolean;
}

interface ProductState {
  catalogId: string;
  products: TypeProduct[];
  companyDetils: {
    logoUrl: string;
    copyRightText: string;
    appName: string;
    salesmanId: number;
    salesmanName: string;
    salesmanMobileNo: string;
  };
  loading: boolean;
  error: string | null;
  totalAmount: number;
  totalQuantity: number;
}

// Initial state
const initialState: ProductState = {
  catalogId: "",
  products: [],
  companyDetils: {
    logoUrl: "",
    copyRightText: "",
    appName: "",
    salesmanId: 0,
    salesmanName: "",
    salesmanMobileNo: "",
  },
  loading: false,
  error: null,
  totalAmount: 0,
  totalQuantity: 0,
};

// Create async thunk for fetching catalog products
export const fetchCatalogProducts = createAsyncThunk(
  "products/fetchCatalogProducts",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await getCatalogProduct(id);
      return { data, catlogId: id };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Something went wrong");
    }
  }
);

// Create the slice
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    updateRemark: (
      state,
      action: PayloadAction<{ id: number; remark: string }>
    ) => {
      const { id, remark } = action.payload;
      const product = state.products.find((p) => p.id === id);
      if (product) {
        product.remark = remark;
      }
    },
    updateSet: (state, action: PayloadAction<{ id: number; set: number }>) => {
      const { id, set } = action.payload;
      const product = state.products.find((p) => p.id === id);
      if (product) {
        product.set = set;
      }
      state.totalQuantity = state.products.reduce(
        (acc, p) => acc + (p.set || 0) * p.qPcs,
        0
      );
      state.totalAmount = state.products.reduce(
        (acc, p) => acc + (p.set || 0) * p.price * p.qPcs,
        0
      );
    },
    resetAllProductSet: (state) => {
      state.products.forEach((p) => {
        p.set = 0;
      });
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
    removeProduct: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.products = state.products.filter((p) => p.id !== id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCatalogProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCatalogProducts.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.products = action.payload?.data?.products || [];
          state.catalogId = action.payload?.catlogId || ""; 
          state.companyDetils = { ...action.payload.data };
        }
      )
      .addCase(
        fetchCatalogProducts.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

// Export selectors
export const selectProducts = (state: RootState): TypeProduct[] =>
  (state.products as ProductState).products;
export const selectCompanyDetils = (
  state: RootState
): {
  logoUrl: string;
  copyRightText: string;
  appName: string;
  salesmanId: number;
  salesmanName: string;
  salesmanMobileNo: string;
} => (state.products as ProductState).companyDetils;
export const selectProductsLoading = (state: RootState): boolean =>
  (state.products as ProductState).loading;
export const selectProductsError = (state: RootState): string | null =>
  (state.products as ProductState).error;
export const selectTotalQuantity = (state: RootState): number =>
  (state.products as ProductState).totalQuantity;
export const selectTotalAmount = (state: RootState): number =>
  (state.products as ProductState).totalAmount;
export const selectProductsWithSet = (state: RootState): TypeProduct[] =>
  (state.products as ProductState).products.filter(
    (p) => p.set !== undefined && p.set !== 0
  );
export const selectCatalogId = (state: RootState): string =>
  (state.products as ProductState).catalogId;

export default productSlice.reducer;
export const { updateRemark, updateSet, removeProduct,resetAllProductSet } = productSlice.actions;
