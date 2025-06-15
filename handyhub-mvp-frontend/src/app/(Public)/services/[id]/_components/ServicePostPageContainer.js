"use client";

import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import SellerDetailsSidebar from "@/components/shared/SellerDetailsSidebar/SellerDetailsSidebar";
import ServiceDetailsContainer from "./ServiceDetailsContainer";
import { useGetSingleServicePostQuery } from "@/redux/api/servicePostApi";
import CustomLoader from "@/components/CustomLoader/CustomLoader";

export default function ServicePostPageContainer({ id }) {
  // Get service post
  const { data: servicePost, isLoading } = useGetSingleServicePostQuery(id, {
    skip: !id,
  });

  if (isLoading) {
    <div className="flex-center h-[50vh]">
      <CustomLoader type="colorful" variant="lg" />;
    </div>;
  }

  return (
    <ResponsiveContainer className="flex-start-between flex-col-reverse gap-x-0 gap-y-8 lg:flex-row lg:gap-x-6 lg:gap-y-0">
      <div className="w-full lg:w-1/4">
        <SellerDetailsSidebar
          sellerProfileData={servicePost?.serviceProvider}
        />
      </div>

      <div className="w-full lg:w-3/4">
        <ServiceDetailsContainer servicePost={servicePost} />
      </div>
    </ResponsiveContainer>
  );
}
