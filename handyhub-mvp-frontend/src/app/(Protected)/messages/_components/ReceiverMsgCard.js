import React, { useEffect, useState } from "react";
import Image from "next/image";
// import TypingLottie from "@/components/TypingLottie/TypingLottie";
import { cn } from "@/lib/utils";
import ImagePreviewer from "@/components/ui/image-previewer";
import CustomAvatar from "@/components/CustomAvatar/CustomAvatar";
import Preview from "@/components/Preview/Preview";

export default function ReceiverMsgCard({
  message,
  isDifferentSender,
  isReceiverTyping,
  selectedUser,
}) {
  const [imagePreviewIndex, setImagePreviewIndex] = useState(-1);
  return (
    <div className="flex-center-start gap-x-2">
      {isDifferentSender ? (
        <>
          <CustomAvatar
            img={selectedUser?.profile}
            name={selectedUser?.name}
            className="size-12 border border-primary-blue"
          />
        </>
      ) : (
        <div className="w-12"></div>
      )}
      <div className="relative mt-2 max-w-max">
        {message?.imageUrl?.length > 0 && (
          <div
            className={cn(
              "mb-2 grid-cols-2 gap-2 rounded-xl border p-2",
              message?.imageUrl?.length > 2 && "grid",
            )}
          >
            {message?.imageUrl?.map((img) => {
              if (img === "") return;
              return (
                <Preview key={img}>
                  <Image
                    src={img?.url}
                    alt={img}
                    height={1200}
                    width={1200}
                    className="border-primary-black/50 mb-2 !h-[100px] !w-[100px] rounded-xl border md:!h-[150px] md:!w-[150px] lg:!h-[200px] lg:!w-[200px]"
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
          <p className="w-fit rounded-3xl border bg-light-primary-blue px-3 py-2 font-medium text-black lg:w-max">
            {message?.text}
          </p>
        )}
      </div>
    </div>
  );
}
