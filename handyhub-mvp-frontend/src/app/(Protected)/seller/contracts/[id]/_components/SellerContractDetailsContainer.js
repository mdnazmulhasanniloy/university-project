"use client";

import { useRouter, useSearchParams } from "next/navigation";
import img1 from "/public/images/customer/image.png";
import img2 from "/public/images/customer/image-1.png";
import img3 from "/public/images/customer/image-2.png";
import img4 from "/public/images/customer/image-3.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import customerAvatar from "/public/images/customer/customer-avatar.jpg";
import { MessageSquareMore } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CustomStarRating from "@/components/CustomStarRating/CustomStarRating";
import { useState } from "react";
import { Textarea } from "@/components/ui/text-area";
import SendQuoteModal from "./SendQuoteModal";
import {
  useGetSingleContractQuery,
  useRejectQuoteMutation,
} from "@/redux/api/contractApi";
import CustomAvatar from "@/components/CustomAvatar/CustomAvatar";
import { formatDate } from "date-fns";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import CustomLoader from "@/components/CustomLoader/CustomLoader";
import { ConfirmModal, ErrorModal, SuccessModal } from "@/utils/customModal";

export default function SellerContractDetailsContainer({ id }) {
  const [showSendBudgetModal, setShowSendBudgetModal] = useState(false);
  const router = useRouter();

  // Get contract details
  const { data: contractDetailsRes, isLoading: isFetchingContractDetails } =
    useGetSingleContractQuery(id, { skip: !id });
  const contractDetails = contractDetailsRes?.data || {};

  // Reject contract
  const [rejectContract, { isLoading: isRejectingContract }] =
    useRejectQuoteMutation();
  const handleRejectQuote = () => {
    ConfirmModal(
      "Are you sure?",
      "This is irreversible and cannot be undone",
      "Reject",
    ).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await rejectContract(id).unwrap();
          SuccessModal("Contract rejected successfully!!");

          router.push("/seller/dashboard?activeTab=contractRequests");
        } catch (error) {
          ErrorModal(error?.message || "Something went wrong");
        }
      }
    });
  };

  if (isFetchingContractDetails) {
    <div className="flex-center h-[50vh]">
      <CustomLoader type="colorful" variant="lg" />;
    </div>;
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <Link
            href="/seller/dashboard?activeTab=contractRequests"
            className="flex-center-start mb-4 block gap-x-1 font-dm-sans text-sm text-primary-blue/70"
          >
            <ArrowLeft size={16} /> Go back to contracts
          </Link>

          <div className="flex items-center gap-4">
            <CustomAvatar
              img={contractDetails?.user?.profile}
              name={contractDetails?.user?.name}
              className="size-16"
            />

            <div className="flex-1">
              <div className="flex items-center justify-between gap-x-3">
                <div>
                  <h2 className="text-2xl font-bold">
                    {contractDetails?.title}
                  </h2>
                  <p className="text-muted-foreground font-dm-sans text-xl font-medium">
                    {contractDetails?.user?.name}
                  </p>
                  <p className="text-muted-foreground font-dm-sans text-sm capitalize">
                    {contractDetails?.user?.role}
                  </p>
                </div>

                <Button variant="blue" size="sm">
                  <MessageSquareMore className="mr-1 h-4 w-4" />
                  Message
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {contractDetails?.quote && (
              <div className="space-y-2">
                <h3 className="font-bold">Given Quote</h3>
                <p className="font-dm-sans text-2xl font-bold">
                  ${contractDetails?.quote}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="font-bold">Service Category</h3>
              <Badge variant="blue" className="font-dm-sans">
                {contractDetails?.servicesPost?.category?.name || "--"}
              </Badge>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold">Type of Contract</h3>

              <Badge variant="violet" className="font-dm-sans">
                {contractDetails?.contractType || "--"}
              </Badge>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold">Completion Date</h3>
              <p className="font-dm-sans">
                {contractDetails?.completionDate &&
                  formatDate(
                    contractDetails?.completionDate,
                    "MMM d, yyyy" || "--",
                  )}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold">Description</h3>

            <ContentWrapper content={contractDetails?.description} />
          </div>

          <div className="space-y-2">
            <h3 className="font-bold">Attached Images</h3>
            <div className="flex-center-start gap-x-5">
              {contractDetails?.images?.map((image, index) => (
                <div key={image?.key} className="relative">
                  <Image
                    src={image?.url}
                    alt={`Attached image ${index + 1}`}
                    height={1200}
                    width={1200}
                    className="max-h-[170px] w-auto rounded-lg object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        {contractDetails?.status === "requested" && (
          <CardFooter className="gap-x-4">
            <Button
              variant="destructiveOutline"
              size="lg"
              className="w-full"
              onClick={handleRejectQuote}
            >
              Reject
            </Button>

            <Button
              variant="success"
              size="lg"
              className="w-full"
              onClick={() => setShowSendBudgetModal(true)}
            >
              Accept & Send Quote
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Send budget modal */}
      <SendQuoteModal
        open={showSendBudgetModal}
        setOpen={setShowSendBudgetModal}
        id={id}
      />
    </>
  );
}
