import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation({
      query: (data) => ({
        url: "/payments/create-payment",
        method: "POST",
        body: data,
      }),

      invalidatesTags: [tagTypes.payment],
    }),

    confirmOrderPayment: builder.mutation({
      query: (data) => ({
        url: `/payments/confirm-payment/${data?.orderId}`,
        method: "GET",
        params: { paymentIntentId: data?.paymentIntentId },
      }),
    }),

    createRefund: builder.mutation({
      query: (data) => ({
        url: "/refund-request",
        method: "POST",
        body: data,
      }),

      invalidatesTags: [tagTypes.refund],
    }),

    getAllRefunds: builder.query({
      query: (arg) => ({
        url: "/refund-request",
        method: "GET",
        params: arg,
      }),

      providesTags: [tagTypes.refund],
    }),

    getRefundStatus: builder.query({
      query: (shopId) => ({
        url: "/refund-request",
        method: "GET",
        params: { shopWiseOrder: shopId },
      }),
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  useConfirmOrderPaymentMutation,
  useCreateRefundMutation,
  useGetRefundStatusQuery,
  useGetAllRefundsQuery,
} = paymentApi;
