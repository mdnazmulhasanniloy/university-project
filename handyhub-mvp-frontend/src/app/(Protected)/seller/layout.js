"use client";
import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import SellerDetailsSidebar from "@/components/shared/SellerDetailsSidebar/SellerDetailsSidebar";
import SellerDashboardProvider from "@/context/SellerDashboardContext";
import { selectUser } from "@/redux/features/authSlice";
import { ErrorModal } from "@/utils/customModal";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function SellerLayout({ children }) {
  const { userId, role } = useSelector(selectUser) ?? {};

  // Logout user if role is not seller
  useEffect(() => {
    if (userId) {
      if (role !== "seller") {
        return ErrorModal("You are not authorized!");
      }
    }
  }, [role, userId]);

  return (
    <SellerDashboardProvider>
      <ResponsiveContainer className="flex-start-between flex-col gap-x-6 gap-y-10 lg:flex-row">
        <div className="w-full xl:w-1/4">
          <SellerDetailsSidebar sellerDashboard={true} />
        </div>

        <div className="w-full xl:w-3/4">{children}</div>
      </ResponsiveContainer>
    </SellerDashboardProvider>
  );
}
