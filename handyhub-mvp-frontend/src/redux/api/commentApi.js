import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommentForPost: builder.query({
      query: (data) => ({
        url: `/comments?post=${data?.postId}`,
        method: "GET",
        params: { ...data.params, sort: "-createdAt" },
      }),
      providesTags: [tagTypes.comments],
      transformResponse: (res) => res?.data,
    }),
    createComment: builder.mutation({
      query: (data) => ({
        url: "/comments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.comments],
    }),

    editComment: builder.mutation({
      query: (data) => ({
        url: `/comments/${data.commentId}`,
        method: "PATCH",
        body: data?.data,
      }),

      invalidatesTags: [tagTypes.comments],
    }),

    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `/comments/${commentId}`,
        method: "DELETE",
      }),

      invalidatesTags: [tagTypes.comments],
    }),
  }),
});

export const {
  useGetCommentForPostQuery,
  useCreateCommentMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
} = commentApi;
