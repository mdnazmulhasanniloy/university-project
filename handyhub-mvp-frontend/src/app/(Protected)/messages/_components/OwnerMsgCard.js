"use client";
import CustomTooltip from "@/components/CustomTooltip/CustomTooltip";
import Preview from "@/components/Preview/Preview";
import ImagePreviewer from "@/components/ui/image-previewer";
import { cn } from "@/lib/utils";
import { CheckCheck } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function OwnerMsgCard({ message }) {
  const [imagePreviewIndex, setImagePreviewIndex] = useState(-1);

  return (
    <div className="mt-2 grid">
      {message?.imageUrl?.length > 0 && (
        <div
          className={cn(
            "mb-2 grid-cols-2 gap-2 rounded-xl border p-2",
            message?.imageUrl?.length > 2 && "grid",
          )}
        >
          {message?.imageUrl?.map((img, idx) => {
            if (img === "") return;
            return (
              <Preview key={img} onClick={() => setImagePreviewIndex(idx)}>
                <Image
                  src={img?.url}
                  alt={img}
                  height={1200}
                  width={1200}
                  className="mb-2 !h-[100px] !w-[100px] rounded-xl border border-black/25 md:!h-[150px] md:!w-[150px] lg:!h-[200px] lg:!w-[200px]"
                />
              </Preview>
            );
          })}

          <ImagePreviewer
            imageUrls={message?.imageUrl?.map((img) => img.url)}
            previewImgIndex={imagePreviewIndex}
            setPreviewImgIndex={setImagePreviewIndex}
          />
        </div>
      )}

      {message?.text && (
        <div className="relative">
          <p
            className={cn(
              "ml-auto w-fit rounded-3xl bg-primary-blue py-2 pl-3 font-medium text-white lg:w-max",
              message?.seen ? "pr-7" : "pr-3",
            )}
          >
            {message?.text}

            {/* Seen indicator */}
            {message?.seen && (
              <CustomTooltip title="Seen">
                <CheckCheck className="absolute bottom-0 right-3 ml-auto block size-3 -translate-y-1 text-green-400" />
              </CustomTooltip>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
