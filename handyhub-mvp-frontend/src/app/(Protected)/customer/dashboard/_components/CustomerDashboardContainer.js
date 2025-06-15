"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContext, useEffect, useState } from "react";
import ContractTables from "./ContractTables";
import { Badge } from "@/components/ui/badge";
import CustomTooltip from "@/components/CustomTooltip/CustomTooltip";
import { Button } from "@/components/ui/button";
import { MessageSquareTextIcon } from "lucide-react";
import { Eye } from "lucide-react";
import Link from "next/link";
import { CustomerDashboardContext } from "@/context/CustomerDashboardContext";
import CustomerSettingsContainer from "./CustomerSettingsContainer";
import CustomAvatar from "@/components/CustomAvatar/CustomAvatar";
import { Star } from "lucide-react";
import { useGetMyContractsQuery } from "@/redux/api/contractApi";
import CustomLoader from "@/components/CustomLoader/CustomLoader";
import { useSearchParams } from "next/navigation";
import { formatDate } from "date-fns";
import textTruncate from "@/utils/textTruncate";

export default function CustomerDashboardContainer() {
  const { selectedTab, setSelectedTab } = useContext(CustomerDashboardContext);

  const query = {};

  query["status"] =
    selectedTab === "requestedContracts"
      ? "requested"
      : selectedTab === "pendingContracts"
        ? "approved||declined"
        : selectedTab === "runningContracts"
          ? "accepted"
          : "completed||cancelled";

  query["limit"] = 999999;

  const { data: contractsRes, isLoading } = useGetMyContractsQuery(query);
  const contracts = contractsRes?.data || [];

  // Check if active tab mentioned the url
  const [activeTab, setActiveTab] = useState(
    useSearchParams()?.get("activeTab"),
  );

  useEffect(() => {
    if (activeTab) {
      setSelectedTab(activeTab);
    }
  }, [activeTab]);

  // Table columns
  const requestedContractsTableColumns = [
    {
      accessorKey: "servicesPost",
      header: "Service Title",
      cell: ({ row }) => {
        const title = row?.original?.servicesPost?.title || "";

        return <p>{textTruncate(title, 25)}</p>;
      },
    },
    {
      accessorKey: "serviceProvider",
      header: "Professional",
      cell: ({ row }) => {
        const { profile, name } = row?.original?.serviceProvider ?? {};
        return (
          <div className="flex-center-start gap-2 text-sm">
            <CustomAvatar img={profile} name={name} />
            <p className="text-center">{name}</p>
          </div>
        );
      },
    },
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
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => {
        const { _id, serviceProvider } = row?.original ?? {};

        return (
          <div>
            <CustomTooltip title="View Contract">
              <Button variant="ghostBlue" size="sm" asChild>
                <Link href={`/customer/contracts/${_id}`}>
                  <Eye className="!size-5" />
                </Link>
              </Button>
            </CustomTooltip>

            {/* <CustomTooltip title="Message Seller">
              <Button variant="ghostBlue" size="sm" asChild>
                <Link href={`/messages?user=${serviceProvider?._id}`}>
                  <MessageSquareTextIcon className="!size-5" />
                </Link>
              </Button>
            </CustomTooltip> */}
          </div>
        );
      },
    },
  ];

  const pendingContractsTableColumns = [
    {
      accessorKey: "servicesPost",
      header: "Service Title",
      cell: ({ row }) => {
        const title = row?.original?.servicesPost?.title || {};

        return <p>{textTruncate(title, 25)}</p>;
      },
    },
    {
      accessorKey: "serviceProvider",
      header: "Professional",
      cell: ({ row }) => {
        const { profile, name } = row?.original?.serviceProvider ?? {};
        return (
          <div className="flex-center-start gap-2 text-sm">
            <CustomAvatar img={profile} name={name} />
            <p className="text-center">{name}</p>
          </div>
        );
      },
    },
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
    },

    {
      accessorKey: "quote",
      header: "Quote Amount",
      cell: ({ row }) => {
        return (
          <Badge variant="success">
            {row?.original?.quote ? `$${row?.original?.quote}` : "--"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row?.original?.status || "--";
        return (
          <Badge
            variant={status === "approved" ? "success" : "destructive"}
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
        const { _id } = row?.original ?? {};

        return (
          <div>
            <CustomTooltip title="View Contract">
              <Button variant="ghostBlue" size="sm" asChild>
                <Link href={`/customer/contracts/${_id}`}>
                  <Eye className="!size-5" />
                </Link>
              </Button>
            </CustomTooltip>

            {/* <CustomTooltip title="Message Seller">
              <Button variant="ghostBlue" size="sm" asChild>
                <Link href={`/messages`}>
                  <MessageSquareTextIcon className="!size-5" />
                </Link>
              </Button>
            </CustomTooltip> */}
          </div>
        );
      },
    },
  ];

  const runningContractsTableColumns = [
    {
      accessorKey: "servicesPost",
      header: "Service Title",
      cell: ({ row }) => {
        const title = row?.original?.servicesPost?.title || {};

        return <p>{textTruncate(title, 25)}</p>;
      },
    },
    {
      accessorKey: "serviceProvider",
      header: "Professional",
      cell: ({ row }) => {
        const { profile, name } = row?.original?.serviceProvider ?? {};
        return (
          <div className="flex-center-start gap-2 text-sm">
            <CustomAvatar img={profile} name={name} />
            <p className="text-center">{name}</p>
          </div>
        );
      },
    },
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
    },

    {
      accessorKey: "quote",
      header: "Quote Amount",
      cell: ({ row }) => {
        return <Badge variant="success">${row?.original?.quote}</Badge>;
      },
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row?.original?.status || "--";
        return (
          <Badge
            variant={status === "accepted" ? "success" : "destructive"}
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
        const { _id } = row?.original ?? {};

        return (
          <div>
            <CustomTooltip title="View Contract">
              <Button variant="ghostBlue" size="sm" asChild>
                <Link href={`/customer/contracts/${_id}`}>
                  <Eye className="!size-5" />
                </Link>
              </Button>
            </CustomTooltip>

            {/* <CustomTooltip title="Message Seller">
              <Button variant="ghostBlue" size="sm" asChild>
                <Link href={`/messages`}>
                  <MessageSquareTextIcon className="!size-5" />
                </Link>
              </Button>
            </CustomTooltip> */}
          </div>
        );
      },
    },
  ];

  const completedContractsTableColumns = [
    {
      accessorKey: "servicesPost",
      header: "Service Title",
      cell: ({ row }) => {
        const title = row?.original?.servicesPost?.title || {};

        return <p>{textTruncate(title, 25)}</p>;
      },
    },
    {
      accessorKey: "serviceProvider",
      header: "Professional",
      cell: ({ row }) => {
        const { profile, name } = row?.original?.serviceProvider ?? {};
        return (
          <div className="flex-center-start gap-2 text-sm">
            <CustomAvatar img={profile} name={name} />
            <p className="text-center">{name}</p>
          </div>
        );
      },
    },
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
      accessorKey: "quote",
      header: "Quote Amount",
      cell: ({ row }) => {
        return <Badge variant="success">${row?.original?.quote}</Badge>;
      },
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row?.original?.status || "--";
        return (
          <Badge
            variant={status === "completed" ? "success" : "destructive"}
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
        const { _id } = row?.original ?? {};

        return (
          <Button variant="blue" size="sm" asChild>
            <Link href={`/customer/contracts/${_id}`}>
              <Star className="!size-4" /> Share Review
            </Link>
          </Button>
        );
      },
    },
  ];

  // Tabs
  if (isLoading) {
    return (
      <div className="flex-center h-[50vh]">
        <CustomLoader variant="lg" type="colorful" />
      </div>
    );
  }

  const tabs = [
    {
      id: "requestedContracts",
      label: "Requested Contracts",
      value: "requestedContracts",
      content: (
        <ContractTables
          columns={requestedContractsTableColumns}
          data={contracts}
          loading={isLoading}
        />
      ),
    },
    {
      id: "pendingContracts",
      label: "Pending Contracts",
      value: "pendingContracts",
      content: (
        <ContractTables
          columns={pendingContractsTableColumns}
          data={contracts}
          loading={isLoading}
        />
      ),
    },
    {
      id: "runningContracts",
      label: "Running Contracts",
      value: "runningContracts",
      content: (
        <ContractTables
          columns={runningContractsTableColumns}
          data={contracts}
          loading={isLoading}
        />
      ),
    },
    {
      id: "completedContracts",
      label: "Completed Contracts",
      value: "completedContracts",
      content: (
        <ContractTables
          columns={completedContractsTableColumns}
          data={contracts}
          loading={isLoading}
        />
      ),
    },
    {
      id: "settings",
      label: "Settings",
      value: "settings",
      content: <CustomerSettingsContainer />,
    },
  ];

  return (
    <Tabs
      value={selectedTab}
      onValueChange={(value) => {
        setSelectedTab(value);
        setActiveTab("");
      }}
      className="w-full overflow-auto"
    >
      <TabsList className="h-full w-full flex-col gap-x-3 overflow-auto rounded-lg border px-3 shadow-none lg:h-14 lg:flex-row">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.value}
            className="w-full max-w-full py-1.5 font-dm-sans text-black shadow-none transition-all duration-300 ease-in-out"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
