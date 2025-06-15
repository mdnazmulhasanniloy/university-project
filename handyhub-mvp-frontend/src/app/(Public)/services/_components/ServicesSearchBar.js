"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ServicesPageContext } from "@/context/ServicesPageContext";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

export default function ServicesSearchBar() {
  const { setSearchTerm, searchTerm } = useContext(ServicesPageContext);
  const [searchText, setSearchText] = useState("");

  // Set search term with debounce
  const [debouncedSearchTerm] = useDebounceValue(searchText, 300);
  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  const searchFromUrl = useSearchParams().get("search");

  useEffect(() => {
    if (searchFromUrl) {
      setSearchText(searchFromUrl);
    }
  }, [searchFromUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      tabIndex="0"
      className="relative mx-auto h-20 w-full rounded-full border border-primary-blue bg-white ring-primary-blue ring-offset-2 ring-offset-white transition-all duration-300 ease-in-out focus-within:ring-2 md:w-11/12 xl:w-3/4"
    >
      <Search className="absolute left-5 top-1/2 mr-2 size-5 shrink-0 -translate-y-1/2 opacity-50" />

      <Input
        name="searchTerm"
        placeholder="Search for services"
        className="block h-full w-full !border-none pl-16 font-dm-sans text-lg !text-black !outline-none !ring-0 !ring-offset-0"
        onChange={(e) => setSearchText(e.target.value)}
        value={searchText}
      />

      <Button
        variant="blue"
        className="absolute right-5 top-1/2 h-12 w-28 -translate-y-1/2 rounded-full"
      >
        Search
      </Button>
    </div>
  );
}
