"use client";

import { baseApi } from "@/redux/api/baseApi";
import { useDispatch } from "react-redux";

export default function useRefetchOnMessage() {
  const dispatch = useDispatch();

  /**
   * This function is used to invalidate tags when a message is received
   */
  const handleInvalidateTags = (tags) => {
    if (!tags) return;
    dispatch(baseApi.util.invalidateTags(tags));
  };

  return { handleInvalidateTags };
}
