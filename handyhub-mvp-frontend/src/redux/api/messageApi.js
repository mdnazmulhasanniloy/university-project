import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (data) => ({
        url: "/messages/send-messages",
        method: "POST",
        body: data,
      }),

      invalidatesTags: [tagTypes.messages],
    }),

    uploadImage: builder.mutation({
      query: (data) => ({
        url: "/upload",
        method: "POST",
        body: data,
      }),

      invalidatesTags: [tagTypes.messages],
    }),
  }),
});

export const { useSendMessageMutation, useUploadImageMutation } = messageApi;
