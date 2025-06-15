import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

const BASE = "/users";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: BASE + "/my-profile",
        method: "GET",
      }),
      providesTags: [tagTypes.user, tagTypes.users, tagTypes.serviceProviders],
      transformResponse: (res) => res?.data,
    }),

    getUserById: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),

    getAllUsers: builder.query({
      query: (arg) => ({
        url: "/users",
        method: "GET",
        params: arg,
      }),

      invalidatesTags: [tagTypes.users],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: BASE + "/update-my-profile",
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: [
        tagTypes.user,
        tagTypes.users,
        tagTypes.serviceProviders,
      ],
    }),

    deleteAccount: builder.mutation({
      query: () => ({
        url: BASE + "/delete-my-account",
        method: "DELETE",
      }),

      invalidatesTags: [tagTypes.user],
    }),
  }),
  // overrideExisting:true
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetAllUsersQuery,
  useDeleteAccountMutation,
  useGetUserByIdQuery,
} = userApi;
