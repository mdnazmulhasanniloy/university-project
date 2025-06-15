"use client";

import { cn } from "@/lib/utils";
import textTruncate from "@/utils/textTruncate";
import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";

export default function ContentWrapper({ content, limit, className }) {
  const [sanitizedContent, setSanitizedContent] = useState("");

  useEffect(() => {
    if (content) {
      setSanitizedContent(
        DOMPurify.sanitize(limit ? textTruncate(content, limit) : content),
      );
    }
  }, [content]);

  return (
    <>
      {sanitizedContent ? (
        <div
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          className={cn("content-wrapper", className)}
          style={{ fontFamily: "var(--font-dm-sans) !important" }}
        />
      ) : (
        <></>
      )}
    </>
  );
}
