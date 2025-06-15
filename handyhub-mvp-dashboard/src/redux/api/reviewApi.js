import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSingleReview: builder.query({
      query: (id) => ({
        url: `/review/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.review],
    }),

    createReview: builder.mutation({
      query: (data) => ({
        url: "/review/create-review",
        method: "POST",
        body: data,
      }),

      invalidatesTags: [tagTypes.review, tagTypes.product, tagTypes.products],
    }),

    updateReview: builder.mutation({
      query: (data) => ({
        url: `/review/update/${data?.reviewId}`,
        method: "PATCH",
        body: data?.reviewData,
      }),

      invalidatesTags: [tagTypes.review, tagTypes.product, tagTypes.products],
    }),

    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `/review/${reviewId}`,
        method: "DELETE",
      }),

      invalidatesTags: [tagTypes.review, tagTypes.product, tagTypes.products],
    }),
  }),
});

export const {
  useGetSingleReviewQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
