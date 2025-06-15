import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: (arg) => ({
        url: `/products`,
        method: "GET",
        params: arg,
      }),

      providesTags: [tagTypes.products],
    }),

    getNewProducts: builder.query({
      query: (arg) => ({
        url: "/products",
        method: "GET",
        params: arg, // arg must have `sort=createdAt`
      }),
      providesTags: [tagTypes.newProducts],
    }),

    getSingleProduct: builder.query({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.product],
    }),

    getRelatedProducts: builder.query({
      query: (id) => ({
        url: `/products?category=${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.products],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetNewProductsQuery,
  useGetSingleProductQuery,
  useGetRelatedProductsQuery,
} = productsApi;
