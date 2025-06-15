"use client";

import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { Button } from "@/components/ui/button";
import placeholderBg from "/public/images/placeholder-bg.svg";
import { ChevronRight } from "lucide-react";
import { useGetProfileQuery } from "@/redux/api/userApi";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/authSlice";
import ContinueToLoginModal from "@/components/ContinueToLoginModal/ContinueToLoginModal";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ServiceDetailsContainer({ servicePost }) {
  const userId = useSelector(selectUser)?.userId;
  const { data: profile } = useGetProfileQuery({}, { skip: !userId });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  const handleContractForService = () => {
    if (!userId) {
      return setShowLoginModal(true);
    }

    setShowLoginModal(false);
    router.push(`/services/${servicePost?._id}/contract`);
  };

  return (
    <div className="rounded-lg bg-foundation-primary-white-light shadow-md">
      <Image
        src={servicePost?.banner || placeholderBg?.src}
        alt="Banner of the service"
        height={1200}
        width={1200}
        className="max-h-[300px] w-full rounded-t-lg object-cover"
      />

      <div className="p-6">
        <h1 className="text-4xl font-bold">{servicePost?.title}</h1>
        <div className="flex-center-start mt-1 text-muted">
          <p>{servicePost?.category?.name || "--"}</p>

          <ChevronRight size={18} />

          <p>
            {servicePost?.services?.map((service, idx) => {
              return (
                service?.name +
                (idx !== servicePost?.services?.length - 1 ? ", " : "")
              );
            })}
          </p>
        </div>

        <ScrollArea className="mt-5">
          <section className="flex w-max space-x-2 pb-2">
            {servicePost?.tags.map((tag) => (
              <div
                key={tag}
                className="flex-center w-max max-w-max whitespace-nowrap rounded-full bg-primary-blue px-4 py-1 text-center text-xs font-semibold capitalize text-white"
              >
                {tag}
              </div>
            ))}
          </section>

          <ScrollBar orientation="horizontal" className="h-2" />
        </ScrollArea>

        <ContentWrapper
          content={servicePost?.description}
          className="mt-5 text-lg"
        />

        {(profile?.role === "customer" || !userId) && (
          <Button
            variant="blue"
            className="mt-8 w-full rounded-full py-6 text-lg font-semibold"
            onClick={handleContractForService}
          >
            Contract for Service
          </Button>
        )}
      </div>

      <ContinueToLoginModal open={showLoginModal} setOpen={setShowLoginModal} />
    </div>
  );
}
