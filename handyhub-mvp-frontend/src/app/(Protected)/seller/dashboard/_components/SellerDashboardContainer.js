"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContext, useEffect, useState } from "react";
import { SellerDashboardContext } from "@/context/SellerDashboardContext";
import SellerProfile from "./SellerProfile";
import SellerServicePosts from "./SellerServicePosts";
import SellerContractRequests from "./SellerContractRequests";
import SellerReviewsContainer from "./SellerReviewsContainer";
import SellerSettingsContainer from "./SellerSettingsContainer";
import { useSearchParams } from "next/navigation";

export default function SellerDashboardContainer() {
  const { selectedTab, setSelectedTab } = useContext(SellerDashboardContext);

  // Tabs
  const tabs = [
    {
      id: "profile",
      label: "Profile",
      value: "profile",
      content: <SellerProfile />,
    },
    {
      id: "servicePosts",
      label: "Service Posts",
      value: "servicePosts",
      content: <SellerServicePosts />,
    },
    {
      id: "contractRequests",
      label: "Contract Requests",
      value: "contractRequests",
      content: <SellerContractRequests />,
    },
    {
      id: "reviews",
      label: "Reviews",
      value: "reviews",
      content: <SellerReviewsContainer />,
    },
    {
      id: "settings",
      label: "Settings",
      value: "settings",
      content: <SellerSettingsContainer />,
    },
  ];

  // Check if active tab mentioned the url
  const [activeTab, setActiveTab] = useState(
    useSearchParams()?.get("activeTab"),
  );

  useEffect(() => {
    if (activeTab) {
      setSelectedTab(activeTab);
    }
  }, [activeTab]);

  return (
    <div>
      <Tabs
        value={selectedTab}
        onValueChange={(value) => {
          setSelectedTab(value);
          setActiveTab("");
        }}
        className="w-full"
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
    </div>
  );
}
