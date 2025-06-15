import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: (arg) => ({ url: "/category", method: "GET", params: arg }),
      providesTags: [tagTypes.categories],
      transformResponse: (res) => ({
        data: res?.data?.data,
        meta: res?.data?.meta,
      }),
    }),

    getCategoryById: builder.query({
      query: (id) => `/category/${id}`,
      providesTags: [tagTypes.category],
      transformResponse: (res) => res?.data,
    }),

    getAllSubcategories: builder.query({
      query: (params) => ({ url: "/subcategory", params }),
      providesTags: [tagTypes.subCategories],
      transformResponse: (res) => ({
        data: res?.data?.data,
        meta: res?.data?.meta,
      }),
    }),

    getSubcategoryByCategoryId: builder.query({
      query: (categoryId) => `/subcategory?category=${categoryId}`,
      providesTags: [tagTypes.subCategory],
      transformResponse: (res) => res?.data,
    }),

    getSubcategoryById: builder.query({
      query: (id) => `/subcategory/${id}`,
      providesTags: [tagTypes.subCategory],
      transformResponse: (res) => res?.data,
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetAllSubcategoriesQuery,
  useGetSubcategoryByCategoryIdQuery,
  useGetSubcategoryByIdQuery,
} = categoryApi;
