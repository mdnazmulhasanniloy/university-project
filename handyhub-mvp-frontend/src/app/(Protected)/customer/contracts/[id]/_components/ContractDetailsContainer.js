"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquareMore } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CustomStarRating from "@/components/CustomStarRating/CustomStarRating";
import { useState } from "react";
import { Textarea } from "@/components/ui/text-area";
import {
  useAcceptContractMutation,
  useCompleteContractMutation,
  useGetSingleContractQuery,
} from "@/redux/api/contractApi";
import CustomAvatar from "@/components/CustomAvatar/CustomAvatar";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { ErrorModal, SuccessModal } from "@/utils/customModal";
import { successToast } from "@/utils/customToast";
import { useCreateReviewMutation } from "@/redux/api/reviewApi";
import { formatDate } from "date-fns";

export default function ContractDetailsContainer({ id }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const router = useRouter();

  // Get service post details
  const { data: contractRes } = useGetSingleContractQuery(id, { skip: !id });
  const contract = contractRes?.data || {};

  // Accept contract
  const [acceptContract, { isLoading: isAcceptingContract }] =
    useAcceptContractMutation();
  const handleAcceptContract = async () => {
    if (!id) {
      return ErrorModal(
        "No contract id found!!",
        "Try creating a contract first.",
      );
    }

    try {
      const res = await acceptContract(id).unwrap();

      if (res?.success) {
        successToast("Success!! Proceeding to payment....");
        window.location.href = res?.data;
      }
    } catch (error) {
      ErrorModal(error?.message || "Something went wrong");
    }
  };

  // Mark contract as complete
  const [completeContract, { isLoading: isCompletingContract }] =
    useCompleteContractMutation();
  const handleMarkContractAsComplete = async () => {
    try {
      await completeContract(id).unwrap();

      successToast("Contract marked as complete!!");
      router.push(`/customer/contracts/${id}/completed`);
    } catch (error) {
      ErrorModal(error?.message || "Something went wrong");
    }
  };

  // Share review for the contract
  const [shareReview, { isLoading: isSharingReview }] =
    useCreateReviewMutation();
  const handleShareReview = async () => {
    if (!review || !rating) {
      return ErrorModal("Please enter review and rating!!");
    }

    if (!contract?.serviceProvider?._id) {
      return ErrorModal("Something went wrong!!", "Please try again later.");
    }

    try {
      await shareReview({
        contract: contract?._id,
        serviceProvider: contract?.serviceProvider?._id,
        rating,
        comment: review,
      }).unwrap();

      SuccessModal("Review added successfully!!");
      router.push(`/seller/${contract?.serviceProvider?._id}`);
    } catch (error) {
      ErrorModal(error?.message || "Something went wrong");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <Link
          href="/customer/dashboard"
          className="flex-center-start mb-4 block gap-x-1 font-dm-sans text-sm text-primary-blue/70"
        >
          <ArrowLeft size={16} /> Go back to contracts
        </Link>

        <div className="flex items-center gap-4">
          <CustomAvatar
            img={contract?.serviceProvider?.profile}
            name={contract?.serviceProvider?.name}
            bannerColor={contract?.serviceProvider?.bannerColor}
            className="size-20 border shadow"
          />

          <div className="flex-1">
            <div className="flex items-center justify-between gap-x-3">
              <div>
                <h2 className="text-2xl font-bold">
                  {contract?.servicesPost?.title}
                </h2>
                <p className="text-muted-foreground font-dm-sans">
                  {contract?.serviceProvider?.name}
                </p>
              </div>

              <Button variant="blue" size="sm" asChild>
                <Link href={`/messages?user=${contract?.serviceProvider?._id}`}>
                  <MessageSquareMore className="mr-1 h-4 w-4" />
                  Message
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {contract?.quote && (
            <div className="space-y-2">
              <h3 className="font-bold">Budget</h3>
              <p className="font-dm-sans text-2xl font-bold">
                ${contract?.quote}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-bold">Service Category</h3>
            <Badge variant="blue" className="font-dm-sans">
              {contract?.servicesPost?.category?.name || "--"}
            </Badge>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold">Type of Contract</h3>

            <Badge variant="violet" className="font-dm-sans">
              {contract?.contractType}
            </Badge>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold">Completion Date</h3>
            <p className="font-dm-sans">
              {contract?.completionDate &&
                formatDate(contract?.completionDate, "MMM d, yyyy" || "--")}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold">Description</h3>

          <ContentWrapper content={contract?.description} />
        </div>

        <div className="space-y-2">
          <h3 className="font-bold">Attached Images</h3>
          <div className="flex-center-start gap-x-5">
            {contract?.images?.map((image, index) => (
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

      {contract?.status === "approved" && (
        <CardFooter className="gap-x-4">
          <Button
            variant="destructiveOutline"
            size="lg"
            className="w-full"
            onClick={() => alert("Coming soon...")}
          >
            Reject
          </Button>

          <Button
            variant="success"
            size="lg"
            className="w-full"
            onClick={handleAcceptContract}
            loading={isAcceptingContract}
            loadingText="Processing..."
          >
            Accept & Proceed to payment
          </Button>
        </CardFooter>
      )}

      {contract?.status === "accepted" && (
        <CardFooter>
          <Button
            variant="success"
            size="lg"
            className="w-full"
            loading={isCompletingContract}
            onClick={handleMarkContractAsComplete}
          >
            Mark As Completed
          </Button>
        </CardFooter>
      )}

      {contract?.status === "completed" && (
        <>
          {contract?.isReviewed ? (
            <div>
              <p>
                Already reviewed!!{" "}
                <Link href={`/seller/${contract?.serviceProvider?._id}`}>
                  See all reviews
                </Link>
              </p>
            </div>
          ) : (
            <CardFooter className="flex-col items-start">
              <h3 className="mb-4 font-bold">Share your review</h3>

              <CustomStarRating
                rating={rating}
                setRating={setRating}
                starSize={32}
              />

              <Textarea
                name="review"
                className="mb-4 mt-5 min-h-28 bg-white"
                placeholder="Write your review..."
                onBlur={(e) => setReview(e.target.value)}
              />

              <Button
                variant="blue"
                size="lg"
                className="w-full"
                loading={isSharingReview}
                onClick={handleShareReview}
              >
                Submit
              </Button>
            </CardFooter>
          )}
        </>
      )}
    </Card>
  );
}
