import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

const serviceProviderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllServiceProviders: builder.query({
      query: (params) => ({
        url: `/users`,
        params: {
          role: "seller",
          ...params,
        },
      }),
      providesTags: [tagTypes.serviceProviders, tagTypes.users],

      transformResponse: (res) => ({
        data: res?.data?.data,
        meta: res?.data?.meta,
      }),
    }),

    getSingleServiceProvider: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: [tagTypes.serviceProvider, tagTypes.user],
      transformResponse: (res) => res?.data,
    }),

    // ---------------------- Seller Activities Api ---------------------
    getAllActivities: builder.query({
      query: (params) => ({
        url: "/activities",
        params: params,
      }),
      providesTags: [tagTypes.allActivities],
      transformResponse: (res) => ({
        data: res?.data?.data,
        meta: res?.data?.meta,
      }),
    }),

    getMyActivities: builder.query({
      query: () => "/activities/my-activity",
      providesTags: [tagTypes.myActivities],
      transformResponse: (res) => ({
        data: res?.data?.data,
        meta: res?.data?.meta,
      }),
    }),

    getActivityById: builder.query({
      query: (id) => `/activities/${id}`,
      providesTags: [tagTypes.activity],
      transformResponse: (res) => res?.data,
    }),

    createActivityPost: builder.mutation({
      query: (data) => ({
        url: "/activities",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.allActivities, tagTypes.myActivities],
    }),

    editActivityPost: builder.mutation({
      query: (data) => ({
        url: `/activities/${data?.id}`,
        method: "PATCH",
        body: data?.data,
      }),
      invalidatesTags: [
        tagTypes.allActivities,
        tagTypes.myActivities,
        tagTypes.activity,
      ],
    }),

    deleteActivityPost: builder.mutation({
      query: (id) => ({
        url: `/activities/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        tagTypes.allActivities,
        tagTypes.myActivities,
        tagTypes.activity,
      ],
    }),

    // -------------- Seller subscription related apis -----------------
    createSubscription: builder.mutation({
      query: (data) => ({
        url: "/subscriptions",
        method: "POST",
        body: data,
      }),

      invalidatesTags: [tagTypes.sellerSubscriptions],
    }),

    getMySubscription: builder.query({
      query: () => "/subscriptions/my-subscriptions",
      providesTags: [tagTypes.sellerSubscriptions],
      transformResponse: (res) => res?.data,
    }),

    getSubscriptionBySellerId: builder.query({
      query: (id) => ({
        url: `/subscriptions/user/${id}`,
        method: "GET",
        providesTags: [tagTypes.sellerSubscriptions],
      }),
      transformResponse: (res) => res?.data,
    }),

    getSubscriptionById: builder.query({
      query: (id) => ({
        url: `/subscriptions/${id}`,
        method: "GET",
        providesTags: [tagTypes.sellerSubscriptions],
      }),
      transformResponse: (res) => res?.data,
    }),

    // ----------------------- Seller Leads(service posts that matches seller services) apis -------------------
    getMyLeads: builder.query({
      query: (query) => ({
        url: "/service-posts",
        method: "GET",
        params: query,
        providesTags: [tagTypes.sellerLeads],
      }),
      transformResponse: (res) => ({
        data: res?.data?.data,
        meta: res?.data?.meta,
      }),
    }),

    getSellerSentRequests: builder.query({
      query: (query) => ({ url: "/requests", method: "GET", params: query }),
      providesTags: [tagTypes.sellerSentRequests, tagTypes.sellerLeads],
      transformResponse: (res) => ({
        data: res?.data?.data,
        meta: res?.data?.meta,
      }),
    }),

    sendRequestForService: builder.mutation({
      query: (data) => ({
        url: "/requests",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.sellerSentRequests, tagTypes.sellerLeads],
    }),

    rejectRequestForService: builder.mutation({
      query: (servicePostId) => ({
        url: `/service-posts/not-interested/${servicePostId}`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.sellerSentRequests, tagTypes.sellerLeads],
    }),

    deleteRequest: builder.mutation({
      query: (requestId) => ({
        url: `/requests/${requestId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.sellerSentRequests, tagTypes.sellerLeads],
    }),
  }),
});

export const {
  useGetAllServiceProvidersQuery,
  useGetSingleServiceProviderQuery,

  // activities api
  useGetMyActivitiesQuery,
  useGetAllActivitiesQuery,
  useGetActivityByIdQuery,
  useCreateActivityPostMutation,
  useEditActivityPostMutation,
  useDeleteActivityPostMutation,

  // Seller subscription apis
  useCreateSubscriptionMutation,
  useGetMySubscriptionQuery,
  useGetSubscriptionBySellerIdQuery,
  useGetSubscriptionByIdQuery,

  // Seller leads apis
  useGetMyLeadsQuery,
  useGetSellerSentRequestsQuery,
  useSendRequestForServiceMutation,
  useRejectRequestForServiceMutation,
  useDeleteRequestMutation,
} = serviceProviderApi;
