import { baseApi } from "./baseApi";
import { tagTypes } from "../tagtypes";

const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: () => ({
        url: "/favorite-item/my-favorite-items",
        method: "GET",
      }),
      providesTags: [tagTypes.wishlist],
    }),

    addToWishlist: builder.mutation({
      query: (data) => ({
        url: "/favorite-item/add-favorite-item",
        method: "POST",
        body: data,
      }),

      invalidatesTags: [tagTypes.wishlist],
    }),

    removeFromWishlist: builder.mutation({
      query: (id) => ({
        url: `/favorite-item/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [tagTypes.wishlist],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApi;
