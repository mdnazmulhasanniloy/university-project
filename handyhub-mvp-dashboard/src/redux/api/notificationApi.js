import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

 

const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotification: builder.query({
      query: (query) => ({
        url: `/notifications`,
        method: "GET",
        params: query,
      }),
      providesTags: [tagTypes.notification],
      transformResponse: (response) => {
        return {
          data: response?.data,
          meta: response?.meta,
        };
      },
    }),
    markAsRead: builder.mutation({
      query: () => ({
        url: `/notifications`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.notification],
    }),
    deleteNotification: builder.mutation({
      query: () => ({
        url: `/notifications`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.notification],
    }),
  }),
});

export const { useGetMyNotificationQuery, useMarkAsReadMutation, useDeleteNotificationMutation } =
  notificationApi;
