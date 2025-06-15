"use client";

import { createContext, useEffect, useState } from "react";

export const CustomerDashboardContext = createContext(null);

const CustomerDashboardProvider = ({ children }) => {
  const [selectedTab, setSelectedTab] = useState("requestedContracts");

  // Values
  const values = {
    selectedTab,
    setSelectedTab,
  };

  return (
    <CustomerDashboardContext.Provider value={values}>
      {children}
    </CustomerDashboardContext.Provider>
  );
};

export default CustomerDashboardProvider;
