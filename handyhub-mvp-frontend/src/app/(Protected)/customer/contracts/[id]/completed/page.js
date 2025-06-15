import ConfettiLottie from "@/components/ConfettiLottie/ConfettiLottie";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default async function ContractCompleteSuccessPage({ params }) {
  const id = (await params)?.id;

  return (
    <div className="flex-center min-h-[50vh]">
      <div>
        <div className="absolute inset-0 -z-10 h-full w-full">
          <ConfettiLottie />
        </div>

        <section className="flex flex-col items-center space-y-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            id="Layer_1"
            x="0"
            y="0"
            version="1.1"
            viewBox="0 0 117.72 117.72"
            height={175}
            width={175}
            className="mx-auto block max-w-max"
          >
            <path
              fill="#01a601"
              d="M58.86 0c9.13 0 17.77 2.08 25.49 5.79-3.16 2.5-6.09 4.9-8.82 7.21a48.7 48.7 0 0 0-16.66-2.92c-13.47 0-25.67 5.46-34.49 14.29-8.83 8.83-14.29 21.02-14.29 34.49s5.46 25.66 14.29 34.49 21.02 14.29 34.49 14.29 25.67-5.46 34.49-14.29c8.83-8.83 14.29-21.02 14.29-34.49 0-3.2-.31-6.34-.9-9.37 2.53-3.3 5.12-6.59 7.77-9.85a58.8 58.8 0 0 1 3.21 19.22c0 16.25-6.59 30.97-17.24 41.62s-25.37 17.24-41.62 17.24-30.97-6.59-41.62-17.24C6.59 89.83 0 75.11 0 58.86s6.59-30.97 17.24-41.62S42.61 0 58.86 0M31.44 49.19 45.8 49l1.07.28c2.9 1.67 5.63 3.58 8.18 5.74a56 56 0 0 1 5.27 5.1c5.15-8.29 10.64-15.9 16.44-22.9a196 196 0 0 1 20.17-20.98l1.4-.54H114l-3.16 3.51C101.13 30 92.32 41.15 84.36 52.65a326 326 0 0 0-21.41 35.62l-1.97 3.8-1.81-3.87c-3.34-7.17-7.34-13.75-12.11-19.63s-10.32-11.1-16.79-15.54z"
            ></path>
          </svg>

          <div className="flex flex-col items-center">
            <h3 className="text-4xl font-bold text-primary-blue">
              Congratulations
            </h3>
            <p className="mb-6 mt-2 text-lg">
              Your contract has been completed. Hope you enjoyed the service!
            </p>

            <Button asChild variant="blue" size="lg">
              <Link href={`/customer/contracts/${id}`}>Share review</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
