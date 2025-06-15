"use client";

import CustomSkeleton from "@/components/CustomSkeleton/CustomSkeleton";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ServicesPageContext } from "@/context/ServicesPageContext";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { MapPinIcon } from "lucide-react";
import { X } from "lucide-react";
import { SlidersHorizontal } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
} from "@/redux/api/categoryApi";
import { useDebounceValue } from "usehooks-ts";
import LocationSearch from "./LocationSearch";

// motion variants
const fadeVariants = {
  initial: {
    opacity: 0,
    y: -50,
    filter: "blur(1px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 380,
      damping: 40,
      mass: 0.4,
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
  exit: {
    opacity: 0,
  },
};

// dummy data
const CATEGORIES = [
  { _id: 1, name: "Plumbing" },
  { _id: 2, name: "Electrician" },
  { _id: 3, name: "Mechanic" },
  { _id: 4, name: "Wood Worker" },
  { _id: 5, name: "Home Maker" },
  { _id: 6, name: "Home Cleaning" },
];

export default function ServiceFilters({ className }) {
  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const mobileFiltersRef = useRef(null);
  const [categoryIdFromSearchUrl, setCategoryIdFromSearchUrl] = useState(
    useSearchParams().get("category"),
  );

  // ============ Get size & category selector from context ============
  const { setLocationSearchTerm, setSelectedCategory, selectedCategory } =
    useContext(ServicesPageContext);

  // Products filter api handlers
  const { data: categoriesRes, isLoading: isCategoriesLoading } =
    useGetAllCategoriesQuery({}, { limit: 999999 });
  const categories = categoriesRes?.data || [];

  // Get single category details
  const { data: singleCategory } = useGetCategoryByIdQuery(
    categoryIdFromSearchUrl,
    { skip: !categoryIdFromSearchUrl },
  );

  useEffect(() => {
    if (singleCategory?._id) {
      return setSelectedCategory({
        _id: singleCategory?._id,
        name: singleCategory?.name,
      });
    }

    setSelectedCategory({ _id: categoryIdFromSearchUrl });
  }, [singleCategory]);

  // Toggle filters on mobile version
  useOnClickOutside(mobileFiltersRef, () => setShowMobileFilters(false));

  return (
    <div className={cn("", className)}>
      {/* Location search bar */}
      <div className="flex-center-between gap-x-4 lg:mb-5">
        <LocationSearch setLocationSearch={setLocationSearchTerm} />

        <button
          className={cn(
            "block rounded-3xl border border-primary-black px-4 py-2 transition-none duration-500 ease-in-out-circ lg:hidden",
            showMobileFilters && "bg-primary-black text-white",
          )}
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <SlidersHorizontal size={24} />
        </button>
      </div>

      {/* --------------- Desktop Version --------------- */}
      <div className="hidden lg:block">
        {/* Category Filter */}
        <div className="space-y-4">
          <motion.div
            className="flex items-center justify-between"
            role="button"
            onClick={() => setCategoryExpanded(!categoryExpanded)}
          >
            <h3 className="mt-2 text-xl font-semibold">Category</h3>
            <ChevronUp
              size={20}
              color="#000000"
              className={cn(
                "transition-all duration-300 ease-in-out",
                categoryExpanded ? "rotate-180" : "rotate-0",
              )}
            />
          </motion.div>

          <AnimatePresence>
            {categoryExpanded && (
              <>
                {isCategoriesLoading ? (
                  <CustomSkeleton
                    className={"mt-5 space-y-3"}
                    skeletonClass="w-full h-5 rounded-xl"
                    length={8}
                  />
                ) : (
                  <ScrollArea className="scroll-shadow h-[550px]">
                    <motion.div
                      className="space-y-5 px-4 font-dm-sans"
                      variants={fadeVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      {categories?.map((category) => (
                        <motion.button
                          key={category?._id}
                          variants={fadeVariants}
                          className={cn("flex-center-start w-full gap-x-3")}
                          onClick={() => {
                            setCategoryIdFromSearchUrl("");

                            if (selectedCategory?._id === category?._id) {
                              return setSelectedCategory({});
                            }
                            setSelectedCategory(category);
                          }}
                        >
                          {/* Checkbox */}
                          <div
                            className={cn(
                              "flex size-[18px] items-center justify-center rounded border border-gray-600 bg-transparent transition-all duration-300 ease-out",
                              category._id === selectedCategory?._id &&
                                "border-none bg-primary-blue text-white",
                            )}
                          >
                            {category._id === selectedCategory?._id && (
                              <Check size={18} />
                            )}
                          </div>

                          <span className="font-dm-sans">{category.name}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  </ScrollArea>
                )}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --------------- Mobile Version --------------- */}
      <div
        className={cn(
          "scroll-hide fixed bottom-0 left-0 z-[999] h-[40vh] w-full overflow-auto rounded-t-2xl border border-primary-black/20 bg-white p-3 shadow-lg transition-all duration-300 ease-in-out-circ",
          showMobileFilters
            ? "visible translate-y-0 opacity-100"
            : "invisible translate-y-[100vh] opacity-0",
        )}
        ref={mobileFiltersRef}
      >
        <div className="flex-center-between">
          <h3 className="text-lg font-semibold">Filters</h3>

          <X
            size={20}
            role="button"
            onClick={() => setShowMobileFilters(false)}
          />
        </div>

        <Separator className="mb-5 mt-2 w-full bg-primary-black" />

        {/* Categories */}
        <div>
          <h4 className="mb-2 font-bold">Categories</h4>

          {isCategoriesLoading ? (
            <CustomSkeleton
              className={"mt-5 space-y-3"}
              skeletonClass="w-full h-5 rounded-xl"
              length={8}
            />
          ) : (
            <div className="flex-center-start flex-wrap gap-3">
              {categories?.map((category) => (
                <button
                  key={category?._id}
                  className={cn(
                    "flex-center-between w-max gap-x-5 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-primary-black",
                    selectedCategory?._id === category?._id &&
                      "bg-primary-black text-white",
                  )}
                  onClick={() => {
                    if (selectedCategory?._id === category?._id) {
                      setSelectedCategory("");
                    } else {
                      setSelectedCategory(category);
                    }
                  }}
                >
                  <p>{category?.name}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
