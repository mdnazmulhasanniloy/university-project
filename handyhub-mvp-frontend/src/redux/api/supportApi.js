import { baseApi } from "./baseApi";

const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    contactSupport: builder.mutation({
      query: (data) => ({
        url: "/contents/support",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useContactSupportMutation } = supportApi;
