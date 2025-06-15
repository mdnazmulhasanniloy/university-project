import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi"; 

const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (data) => ({
          url: `/category`,
          method: "POST",
          body: data
      }),
      invalidatesTags: [tagTypes.category],
  }),
  updateCategory: builder.mutation({
      query: ({data, id}) => ({
          url: `/category/${id}`,
          method: "PATCH",
          body: data
      }),
      invalidatesTags: [tagTypes.category],
  }),
  deleteCategory: builder.mutation({
      query: (id) => ({
          url: `/category/${id}`,
          method: "DELETE", 
      }),
      invalidatesTags: [tagTypes.category],
  }),
  getCategories: builder.query({
      query: (query ) => ({
          url: `/category`,
          method: "GET",
          params:query
      }),
      providesTags: [tagTypes.category],
  }),
  }),
});

export const {  
     useCreateCategoryMutation,
     useUpdateCategoryMutation,
     useDeleteCategoryMutation,
     useGetCategoriesQuery,
   
 } = categoryApi;
