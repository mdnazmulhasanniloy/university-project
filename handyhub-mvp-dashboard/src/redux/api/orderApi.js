import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: "/order/create-orders",
        method: "POST",
        body: data,
      }),

      invalidatesTags: [tagTypes.orders],
    }),

    getOrders: builder.query({
      query: (arg) => ({
        url: "/order/my-orders",
        method: "GET",
        params: arg,
      }),

      providesTags: [tagTypes.orders],
    }),

    getSingleOrder: builder.query({
      query: (id) => ({
        url: `/order/${id}`,
        method: "GET",
      }),

      providesTags: [tagTypes.order],
    }),

    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `/order/${orderId}`,
        method: "DELETE",
      }),

      invalidatesTags: [tagTypes.orders, tagTypes.order],
    }),

    orderReviewDone: builder.mutation({
      query: (productId) => ({
        url: `/incomes/order-review-done/${productId}`,
        method: "PATCH",
      }),

      invalidatesTags: [tagTypes.products, tagTypes.orders],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetSingleOrderQuery,
  useDeleteOrderMutation,
  useOrderReviewDoneMutation,
} = orderApi;
