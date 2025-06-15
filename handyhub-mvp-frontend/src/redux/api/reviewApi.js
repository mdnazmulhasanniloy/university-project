import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServiceProviderReviews: builder.query({
      query: (arg) => ({ url: "/reviews", method: "GET", params: arg }),
      providesTags: [tagTypes.reviews],
      transformResponse: (res) => res?.data,
    }),

    createReview: builder.mutation({
      query: (data) => ({
        url: "/reviews",
        method: "POST",
        body: data,
      }),

      invalidatesTags: [tagTypes.reviews, tagTypes.contracts],
    }),
  }),
});

export const { useCreateReviewMutation, useGetServiceProviderReviewsQuery } =
  reviewApi;
