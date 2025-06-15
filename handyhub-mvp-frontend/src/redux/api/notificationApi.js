import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotifications: builder.query({
      query: (params) => ({ url: "/notifications", method: "GET", params }),
      providesTags: [tagTypes.notifications],
      transformResponse: (res) => ({
        data: res?.data,
        meta: res?.meta,
      }),
    }),

    readAllNotification: builder.mutation({
      query: () => ({
        url: "/notifications",
        method: "PATCH",
      }),

      invalidatesTags: [tagTypes.notifications],
    }),

    removeNotifications: builder.mutation({
      query: () => ({
        url: "/notifications",
        method: "DELETE",
      }),

      invalidatesTags: [tagTypes.notifications],
    }),
  }),
});

export const {
  useGetAllNotificationsQuery,
  useReadAllNotificationMutation,
  useRemoveNotificationsMutation,
} = notificationApi;
