"use client";

import AnimatedArrow from "@/components/AnimatedArrow/AnimatedArrow";
import ConfettiLottie from "@/components/ConfettiLottie/ConfettiLottie";
import CustomLoader from "@/components/CustomLoader/CustomLoader";
import SuccessLottie from "@/components/SuccessLottie/SuccessLottie";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetSingleContractQuery } from "@/redux/api/contractApi";
import { useGetSubscriptionByIdQuery } from "@/redux/api/serviceProviderApi";
import { selectUser } from "@/redux/features/authSlice";
import { ErrorModal } from "@/utils/customModal";
import { format } from "date-fns";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";

export default function ContractPaymentSuccessContainer() {
  const router = useRouter();
  const userId = useSelector(selectUser)?.userId;

  // Get contract id from search params
  const contractId = useSearchParams().get("contractId");

  const { data: contract, isLoading: isContractLoading } =
    useGetSingleContractQuery(contractId, { skip: !contractId });

  if (!userId) {
    ErrorModal("Unauthorized access");
    router.push("/");
    return;
  }

  if (!contractId) {
    ErrorModal("Forbidden access!!");
    router.push("/");
    return;
  }

  if (isContractLoading) {
    return (
      <div className="flex-center h-[65vh]">
        <CustomLoader type="colorful" variant="lg" />
      </div>
    );
  }

  if (!contract?.success && !isContractLoading) {
    ErrorModal("Forbidden access!!");
    router.push("/");
    return;
  }

  return (
    <div className="z-10">
      <SuccessLottie />

      <div className="absolute inset-0 -z-10 h-full w-full">
        <ConfettiLottie />
      </div>

      <div className="flex-center mt-5 text-center">
        <motion.div
          initial={{
            y: 100,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            delay: 1.3,
            type: "spring",
            stiffness: 250,
            damping: 30,
            mass: 0.2,
          }}
          className="max-h-fit overflow-hidden"
        >
          <h2 className="text-5xl font-bold text-primary-blue">
            Congratulations!
          </h2>

          <p className="mt-6 text-center font-dm-sans text-lg text-black/75">
            You&apos;ve successfully paid for the contract <span></span> with
            the following transaction id: <span></span>.
            <br /> Hope you enjoy the service!
          </p>

          <div className="mx-auto mt-8 flex w-max items-center gap-x-5 p-1">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full"
              asChild
            >
              <Link href="/seller/dashboard">Explore Other Services</Link>
            </Button>

            <Button
              className="group rounded-full"
              variant="blue"
              size="lg"
              asChild
            >
              <Link href={`/customer/contracts/${contractId}`}>
                View Details <AnimatedArrow />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
