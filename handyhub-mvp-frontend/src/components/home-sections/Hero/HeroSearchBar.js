"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function HeroSearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    let route = "";

    if (searchTerm) {
      route = `/services?search=${searchTerm}`;
    } else {
      route = "/services";
    }

    router.push(route);
  };

  return (
    <div
      tabIndex="0"
      className="relative mx-auto h-14 w-full rounded-full border border-foundation-primary-white-dark ring-primary-orange ring-offset-2 ring-offset-white transition-all duration-300 ease-in-out focus-within:ring-2 md:w-11/12 lg:w-3/4 2xl:w-1/2"
    >
      <Search className="absolute left-4 top-1/2 mr-2 size-5 shrink-0 -translate-y-1/2 opacity-50" />

      <Input
        name="searchTerm"
        placeholder="Search for services"
        className="block h-full w-full !border-none pl-12 font-dm-sans !text-base !text-black !outline-none !ring-0 !ring-offset-0"
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />

      <Button
        variant="orange"
        className="absolute right-3 top-1/2 w-24 -translate-y-1/2 rounded-full"
        onClick={handleSearch}
      >
        Search
      </Button>
    </div>
  );
}
