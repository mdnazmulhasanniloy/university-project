"use client";

import { useSearchParams } from "next/navigation";
import { createContext, useEffect, useState } from "react";

export const ServicesPageContext = createContext(null);

export default function ServicesPageProvider({ children }) {
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState({});
  const [selectedSubcategory, setSelectedSubcategory] = useState({});
  const [locationSearchTerm, setLocationSearchTerm] = useState("");

  const searchFromUrl = useSearchParams().get("search");
  useEffect(() => {
    setSearchTerm(searchFromUrl || "");
  }, [searchFromUrl]);

  return (
    <ServicesPageContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        selectedSubcategory,
        setSelectedSubcategory,
        locationSearchTerm,
        setLocationSearchTerm,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </ServicesPageContext.Provider>
  );
}
