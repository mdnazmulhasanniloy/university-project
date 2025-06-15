"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import CustomAvatar from "@/components/CustomAvatar/CustomAvatar";
import ContractTables from "@/app/(Protected)/customer/dashboard/_components/ContractTables";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import CustomTooltip from "@/components/CustomTooltip/CustomTooltip";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { MessageSquareTextIcon } from "lucide-react";
import customerAvatar from "/public/images/customer/customer-avatar.jpg";
import { useGetServiceProviderContractsQuery } from "@/redux/api/contractApi";
import textTruncate from "@/utils/textTruncate";
import CustomLoader from "@/components/CustomLoader/CustomLoader";
import { formatDate } from "date-fns";

const SERVICE_REQUEST_TYPE = [
  "all",
  "pending",
  "responded",
  "running",
  "completed",
];

export default function SellerContractRequests() {
  const [selectedContractRequestType, setSelectedContractRequestType] =
    useState("all");

  const query = {};

  query["status"] =
    selectedContractRequestType === "all"
      ? ""
      : selectedContractRequestType === "pending"
        ? "requested"
        : selectedContractRequestType === "responded"
          ? "approved||declined"
          : selectedContractRequestType === "running"
            ? "accepted"
            : "completed||cancelled";

  query["limit"] = 999999;
  query["sort"] = "-createdAt";

  const { data: contractsRes, isLoading } =
    useGetServiceProviderContractsQuery(query);
  const contracts = contractsRes?.data || [];

  // Table columns
  const allContractsTableColumns = [
    {
      accessorKey: "servicesPost",
      header: "Service Title",
      cell: ({ row }) => {
        const title = row?.original?.servicesPost?.title || "";

        return <div className="max-w-4">{textTruncate(title, 25)}</div>;
      },
    },
    // {
    //   accessorKey: "user",
    //   header: "Customer",
    //   cell: ({ row }) => {
    //     const { profile, name } = row?.original?.user ?? {};
    //     return (
    //       <div className="flex-center-start gap-2 text-sm">
    //         <CustomAvatar img={profile} name={name} />
    //         <p className="text-center">{name}</p>
    //       </div>
    //     );
    //   },
    // },
    {
      accessorKey: "contractType",
      header: "Contract Type",

      meta: {
        filterVariant: "select",
        filters: [
          { label: "All", value: "" },
          {
            label: "Project Based",
            value: "Project Based",
          },
          {
            label: "Hourly",
            value: "Hourly",
          },
        ],
      },

      cell: ({ row }) => {
        return (
          <Badge
            variant={
              row.original.contractType === "Project Based" ? "violet" : "blue"
            }
          >
            {row.original.contractType}
          </Badge>
        );
      },
    },
    {
      accessorKey: "completionDate",
      header: "Completion Date",
      cell: ({ row }) => {
        const { completionDate } = row?.original ?? {};

        return (
          <p>
            {completionDate &&
              formatDate(completionDate, "MMM d, yyyy" || "--")}
          </p>
        );
      },
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => {
        const title = row?.original?.address || "";

        return <div className="max-w-4">{textTruncate(title, 25)}</div>;
      },
    },
    {
      accessorKey: "quote",
      header: "Given Quote",
      cell: ({ row }) => {
        const quote = row?.original?.quote || "";

        return <div className="max-w-4">{quote ? "$" + quote : "--"}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const { status } = row?.original ?? {};

        return (
          <Badge
            variant={
              status === "accepted"
                ? "orange"
                : status === "requested"
                  ? "blue"
                  : status === "approved" || status === "completed"
                    ? "success"
                    : "destructive"
            }
            className="capitalize"
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => {
        const { _id, user } = row?.original ?? {};

        return (
          <div>
            <CustomTooltip title="View Contract">
              <Button variant="ghostBlue" size="sm" asChild>
                <Link href={`/seller/contracts/${_id}`}>
                  <Eye className="!size-5" />
                </Link>
              </Button>
            </CustomTooltip>

            <CustomTooltip title="Message Customer">
              <Button variant="ghostBlue" size="sm" asChild>
                <Link href={`/messages?user=${user?._id}`}>
                  <MessageSquareTextIcon className="!size-5" />
                </Link>
              </Button>
            </CustomTooltip>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    <div className="flex-center h-[50vh]">
      <CustomLoader type="colorful" variant="lg" />;
    </div>;
  }

  return (
    <section className="mt-4 rounded-lg border bg-white p-8 shadow-md">
      <div className="flex-center-between ml-auto">
        <h3 className="text-xl font-medium">My Contract Requests</h3>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex-center-between gap-x-2 rounded-md border border-gray-300 px-4 py-2 font-medium capitalize">
            {selectedContractRequestType} <ChevronDown size={18} />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-48">
            {SERVICE_REQUEST_TYPE.map((type) => (
              <DropdownMenuItem
                key={type}
                className={`cursor-pointer px-4 py-2 font-dm-sans capitalize hover:bg-gray-100 ${
                  selectedContractRequestType === type ? "bg-gray-100" : ""
                }`}
                onClick={() => setSelectedContractRequestType(type)}
              >
                {type}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Contract Requests */}
      <ContractTables columns={allContractsTableColumns} data={contracts} />
    </section>
  );
}
