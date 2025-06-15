import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

const servicePostApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllServicePosts: builder.query({
      query: (arg) => ({
        url: "/service-post",
        method: "GET",
        params: arg,
      }),

      providesTags: [tagTypes.servicePosts],
    }),

    getMyServicePosts: builder.query({
      query: (arg) => ({
        url: "/service-post/my-post",
        method: "GET",
        params: arg,
      }),

      providesTags: [tagTypes.myServicePosts],
    }),

    getSingleServicePost: builder.query({
      query: (id) => `/service-post/${id}`,
      transformResponse: (res) => res?.data,
      providesTags: [tagTypes.servicePost],
    }),

    createServicePost: builder.mutation({
      query: (data) => ({
        url: "/service-post",
        method: "POST",
        body: data,
      }),

      invalidatesTags: [
        tagTypes.servicePosts,
        tagTypes.myServicePosts,
        tagTypes.servicePost,
      ],
    }),

    editServicePost: builder.mutation({
      query: (data) => ({
        url: `/service-post/${data?.id}`,
        method: "PATCH",
        body: data?.data,
      }),

      invalidatesTags: [
        tagTypes.servicePosts,
        tagTypes.myServicePosts,
        tagTypes.servicePost,
      ],
    }),

    deleteServicePost: builder.mutation({
      query: (id) => ({
        url: `/service-post/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [tagTypes.servicePosts, tagTypes.myServicePosts],
    }),
  }),
});

export const {
  useGetAllServicePostsQuery,
  useGetSingleServicePostQuery,
  useGetMyServicePostsQuery,
  useCreateServicePostMutation,
  useEditServicePostMutation,
  useDeleteServicePostMutation,
} = servicePostApi;
