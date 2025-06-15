import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

const subcategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSubcategory: builder.mutation({
      query: (data) => ({
        url: `/subcategory`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.subcategory],
    }),
    updateSubcategory: builder.mutation({
      query: ({ data, id }) => ({
        url: `/subcategory/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.subcategory],
    }),
    deleteSubcategory: builder.mutation({
      query: (id) => ({
        url: `/subcategory/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.subcategory],
    }),
    getSubcategories: builder.query({
      query: (query) => ({
        url: `/subcategory`,
        method: "GET",
        params: query,
      }),
      providesTags: [tagTypes.subcategory],
    }),
  }),
});

export const {
    useCreateSubcategoryMutation,
    useUpdateSubcategoryMutation,
    useDeleteSubcategoryMutation,
    useGetSubcategoriesQuery,
  
} = subcategoryApi;
