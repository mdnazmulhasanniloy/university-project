import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import CustomAvatar from "@/components/CustomAvatar/CustomAvatar";
import CustomTooltip from "@/components/CustomTooltip/CustomTooltip";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useDeleteServicePostMutation } from "@/redux/api/servicePostApi";
import { ConfirmModal, ErrorModal, SuccessModal } from "@/utils/customModal";
import textTruncate from "@/utils/textTruncate";
import { Trash2 } from "lucide-react";
import { PencilRuler } from "lucide-react";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function ServicePostCard({
  servicePost,
  sellerDashboard = false,
  sellerPage = false,
}) {
  // Delete service post api handler
  const [deleteServicePost, { isLoading: isDeleting }] =
    useDeleteServicePostMutation();
  const handleDeleteServicePost = async () => {
    ConfirmModal(
      "Are you sure?",
      "This post will be deleted permanently!",
    ).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await deleteServicePost(servicePost?._id).unwrap();
          SuccessModal("Post deleted successfully!!");
        } catch (error) {
          ErrorModal(error?.message || "Something went wrong");
        }
      }
    });
  };

  return (
    <div className="card-gradient h-full rounded-3xl p-[1px]">
      <div className="flex h-full flex-col justify-between rounded-3xl bg-[#f9fcff] p-4 duration-300 ease-in-out animate-in hover:shadow-xl">
        <div className="relative">
          <Image
            src={servicePost?.banner}
            alt={servicePost?.title}
            height={1200}
            width={1200}
            className="max-h-[200px] w-full rounded-[19px] object-cover"
          />

          {sellerDashboard && (
            <div className="flex-start-end absolute right-0 top-0 h-[80px] w-full gap-x-2 p-2">
              <CustomTooltip title="Update Post">
                <Button
                  variant="blue"
                  size="icon"
                  className="rounded-full"
                  asChild
                >
                  <Link
                    href={`/seller/dashboard/edit-service-post/${servicePost?._id}`}
                  >
                    <PencilRuler />
                  </Link>
                </Button>
              </CustomTooltip>

              <CustomTooltip title="Delete Post">
                <Button
                  variant="destructive"
                  size="icon"
                  className="rounded-full"
                  onClick={handleDeleteServicePost}
                  disabled={isDeleting}
                >
                  <Trash2 />
                </Button>
              </CustomTooltip>
            </div>
          )}
        </div>

        <div className="mt-3">
          <Link
            href={`/services/${servicePost?._id}`}
            className="text-xl font-bold"
          >
            {textTruncate(servicePost?.title, 120)}
          </Link>

          {!sellerPage && (
            <>
              <div className="flex-center-between mb-3 mt-2">
                <div className="flex-center-start gap-x-2">
                  <CustomAvatar
                    img={servicePost?.serviceProvider?.profile}
                    name={servicePost?.serviceProvider?.name}
                    className="size-7 text-sm"
                  />

                  <p className="font-dm-sans text-sm">
                    {servicePost?.serviceProvider?.name}
                  </p>
                </div>

                {servicePost?.address && (
                  <div className="flex-center-start gap-x-2 text-end text-sm">
                    <MapPin className="size-4 text-muted" />
                    <CustomTooltip title={servicePost.address}>
                      <p>{textTruncate(servicePost.address, 20)}</p>
                    </CustomTooltip>
                  </div>
                )}
              </div>
            </>
          )}

          <ContentWrapper content={servicePost?.description} limit={120} />
        </div>

        <ScrollArea className="mt-4">
          <section className="flex w-max space-x-2 pb-2">
            {servicePost?.tags.map((tag) => (
              <div
                key={tag}
                className="flex-center w-max max-w-max whitespace-nowrap rounded-full bg-primary-blue px-4 py-1 text-center text-xs font-semibold text-white"
              >
                {tag}
              </div>
            ))}
          </section>

          <ScrollBar orientation="horizontal" className="h-2" />
        </ScrollArea>
      </div>
    </div>
  );
}
