"use client";

import { createContext, useState } from "react";

export const SellerDashboardContext = createContext(null);

const SellerDashboardProvider = ({ children }) => {
  const [selectedTab, setSelectedTab] = useState("profile");

  // Values
  const values = {
    selectedTab,
    setSelectedTab,
  };

  return (
    <SellerDashboardContext.Provider value={values}>
      {children}
    </SellerDashboardContext.Provider>
  );
};

export default SellerDashboardProvider;
