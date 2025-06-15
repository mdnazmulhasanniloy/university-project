import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

const packageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPackager: builder.mutation({
      query: (data) => ({
        url: "/packages",
        method: "POST",
        body: data,
      }),

      invalidatesTags: [tagTypes.package],
    }),

    getPackages: builder.query({
      query: (arg) => ({
        url: "/packages",
        method: "GET",
        params: arg,
      }),

      providesTags: [tagTypes.package],
    }),

    getSinglePackage: builder.query({
      query: (id) => ({
        url: `/packages/${id}`,
        method: "GET",
      }),

      providesTags: [tagTypes.package],
    }),

    deletePackage: builder.mutation({
      query: (id) => ({
        url: `/packages/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [tagTypes.package],
    }),
    updatePackage: builder.mutation({
        query: ({id, data}) => ({
          url: `/packages/${id}`,
          method: "PATCH",
          body: data,
        }),
  
        invalidatesTags: [tagTypes.package],
      }),
  }),
});

export const {
  useCreatePackagerMutation,
  useGetPackagesQuery,
  useGetSinglePackageQuery,
  useDeletePackageMutation,
  useUpdatePackageMutation,
} = packageApi;
