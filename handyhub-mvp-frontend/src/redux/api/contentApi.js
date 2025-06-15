import { baseApi } from "./baseApi";

const contentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContent: builder.query({
      query: () => ({
        url: "/contents",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetContentQuery } = contentApi;
