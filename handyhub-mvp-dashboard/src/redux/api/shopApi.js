import { baseApi } from "./baseApi";
import { tagTypes } from "../tagtypes";

const shopApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShopById: builder.query({
      query: (shopId) => ({
        url: `/shop/${shopId}`,
        method: "GET",
      }),

      providesTags: [tagTypes.shop],
    }),
  }),
});

export const { useGetShopByIdQuery } = shopApi;
