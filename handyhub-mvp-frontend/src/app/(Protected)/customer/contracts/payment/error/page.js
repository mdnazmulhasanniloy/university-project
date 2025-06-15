import { X } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function ContractPaymentErrorPage() {
  return (
    <div className="flex-center h-[75vh]">
      <div>
        <div className="mb-12">
          <div className="flex-center mx-auto mb-6 aspect-square size-28 rounded-full border-4 border-danger bg-transparent text-danger">
            <X className="size-16" />
          </div>

          <h1 className="text-center text-2xl font-bold text-danger">
            404 | Payment Failed
          </h1>
        </div>

        <Link
          href="/customer/dashboard?activeTab=pendingRequests"
          className="flex-center group gap-x-2 font-dm-sans text-primary-blue"
        >
          <ArrowLeft
            size={20}
            className="transition-transform duration-300 ease-in-out group-hover:-translate-x-2"
          />{" "}
          Go back
        </Link>
      </div>
    </div>
  );
}
