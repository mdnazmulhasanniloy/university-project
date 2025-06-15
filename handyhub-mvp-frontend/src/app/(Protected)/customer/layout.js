"use client";

import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import CustomerProfileSidebar from "./_components/CustomerProfileSidebar";
import CustomerDashboardProvider from "@/context/CustomerDashboardContext";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/authSlice";
import { ErrorModal } from "@/utils/customModal";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function CustomerLayout({ children }) {
  const { userId, role } = useSelector(selectUser) ?? {};
  const currentPath = usePathname();

  // Logout user if role is not customer
  useEffect(() => {
    if (userId) {
      if (role !== "customer") {
        return ErrorModal("You are not authorized!");
      }
    }
  }, [role, userId]);

  return (
    <CustomerDashboardProvider>
      <ResponsiveContainer className="flex-start-between flex-col gap-x-6 gap-y-6 lg:flex-row">
        {!currentPath?.includes("payment") && (
          <div className="w-full xl:w-1/4">
            <CustomerProfileSidebar />
          </div>
        )}

        <div
          className={cn(
            "w-full xl:w-3/4",
            currentPath?.includes("payment") && "xl:w-full",
          )}
        >
          {children}
        </div>
      </ResponsiveContainer>
    </CustomerDashboardProvider>
  );
}
