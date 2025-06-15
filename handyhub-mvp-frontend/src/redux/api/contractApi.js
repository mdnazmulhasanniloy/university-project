import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

const contractApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyContracts: builder.query({
      query: (arg) => ({
        url: "/contract/my-contracts",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.contracts],
      transformResponse: (res) => ({
        data: res?.data?.data,
        meta: res?.data?.meta,
      }),
    }),

    getServiceProviderContracts: builder.query({
      query: (arg) => ({
        url: "/contract/service-provider",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.contracts],
      transformResponse: (res) => ({
        data: res?.data?.data,
        meta: res?.data?.meta,
      }),
    }),

    getAllContracts: builder.query({
      query: (arg) => ({ url: "/contract", method: "GET", params: arg }),
      providesTags: [tagTypes.contracts],
      transformResponse: (res) => ({
        data: res?.data?.data,
        meta: res?.data?.meta,
      }),
    }),

    createContract: builder.mutation({
      query: (data) => ({
        url: "/contract",
        method: "POST",
        body: data,
      }),

      invalidatesTags: [tagTypes.contracts],
    }),

    getSingleContract: builder.query({
      query: (id) => ({
        url: `/contract/${id}`,
        method: "GET",
      }),

      providesTags: [tagTypes.contract],
    }),

    // Customer-end apis
    acceptContract: builder.mutation({
      query: (contractId) => ({
        url: `/payments/checkout`,
        method: "POST",
        body: { contract: contractId },
      }),

      invalidatesTags: [tagTypes.contracts],
    }),

    completeContract: builder.mutation({
      query: (contractId) => ({
        url: `/contract/completed/${contractId}`,
        method: "PATCH",
        body: {},
      }),

      invalidatesTags: [tagTypes.contracts],
    }),

    // Seller-end apis
    approveAndSendQuote: builder.mutation({
      query: ({ id: contractId, data }) => ({
        url: `/contract/approved/${contractId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.contracts, tagTypes.contract],
    }),

    rejectQuote: builder.mutation({
      query: (id) => ({
        url: `/contract/declined/${id}`,
        method: "PATCH",
        body: {},
      }),

      invalidatesTags: [tagTypes.contracts, tagTypes.contract],
    }),
  }),
});

export const {
  useCreateContractMutation,
  useGetAllContractsQuery,
  useGetMyContractsQuery,
  useGetServiceProviderContractsQuery,
  useGetSingleContractQuery,

  // customer-end apis
  useAcceptContractMutation,
  useCompleteContractMutation,

  // seller-end apis
  useApproveAndSendQuoteMutation,
  useRejectQuoteMutation,
} = contractApi;
