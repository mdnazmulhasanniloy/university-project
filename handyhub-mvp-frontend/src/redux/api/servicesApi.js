import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

const servicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllServices: builder.query({
      query: (arg) => ({
        url: "/services",
        method: "GET",
        params: arg,
      }),

      providesTags: [tagTypes.services],
    }),

    addNewService: builder.mutation({
      query: (data) => ({
        url: "/services",
        method: "POST",
        body: data,
      }),

      invalidatesTags: [tagTypes.services],
    }),
  }),
});

export const { useGetAllServicesQuery, useAddNewServiceMutation } = servicesApi;
