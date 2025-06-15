"use client";

import serviceBanner1 from "/public/images/services/service-post-1.png";
import serviceBanner2 from "/public/images/services/service-post-2.png";
import serviceBanner3 from "/public/images/services/service-post-3.png";
import authorAvatar from "/public/images/services/avatar.png";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { fadeUpWithBlurVariants } from "@/utils/sharedMotionVariants";
import ServicePostCard from "./ServicePostCard";
import CustomPagination from "@/components/CustomPagination/CustomPagination";
import EmptyContainer from "@/components/EmptyContainer/EmptyContainer";
import { useContext, useState } from "react";
import { useGetAllServicePostsQuery } from "@/redux/api/servicePostApi";
import { ServicesPageContext } from "@/context/ServicesPageContext";
import { useSelector } from "react-redux";
import { selectLocation, setLocation } from "@/redux/features/geoLocationSlice";
import { useSetGeoLocation } from "@/hooks/useSetGeoLocation";
import { successToast } from "@/utils/customToast";
import { ErrorModal } from "@/utils/customModal";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import CustomLoader from "@/components/CustomLoader/CustomLoader";
import ProductCardSkeleton from "./ServicePostCardSkeleton";

export default function ServicesContainer({ className }) {
  const dispatch = useDispatch();
  const {
    selectedCategory,
    setSelectedCategory,
    locationSearchTerm,
    searchTerm,
  } = useContext(ServicesPageContext);

  // ============== Pagination ============== //
  const [currentPage, setCurrentPage] = useState(1);

  const query = {};
  query["page"] = currentPage;
  query["category"] = selectedCategory?._id || "";
  query["searchTerm"] = searchTerm;

  // Show nearby local states
  const setGeoLocationToStore = useSetGeoLocation(); // function to set user's geoLocation in redux store
  const geoLocation = useSelector(selectLocation);

  // ==================== Set location coord in query ====================
  if (geoLocation?.coordinates?.length > 1) {
    // check if both lat and long are 0
    if (geoLocation?.coordinates?.every((value) => value === 0)) {
      query["latitude"] = "";
      query["longitude"] = "";
    } else {
      query["longitude"] = geoLocation?.coordinates[0];
      query["latitude"] = geoLocation?.coordinates[1];
    }
  }

  if (locationSearchTerm?.coordinates?.length > 1) {
    if (locationSearchTerm?.coordinates?.every((value) => value === 0)) {
      query["latitude"] = "";
      query["longitude"] = "";
    } else {
      query["longitude"] = locationSearchTerm?.coordinates[0];
      query["latitude"] = locationSearchTerm?.coordinates[1];
    }
  }

  // Show nearby handler
  const handleShowNearbyResults = async (findNearby) => {
    if (findNearby) {
      try {
        await setGeoLocationToStore();
        successToast("Location updated");
      } catch (err) {
        ErrorModal("Something went wrong");
      }

      return;
    }

    dispatch(setLocation({ coordinates: null }));
    successToast("Location removed");
  };

  // Get all service posts
  const { data: servicePostsRes, isLoading: isServicePostsLoading } =
    useGetAllServicePostsQuery(query);
  const servicePosts = servicePostsRes?.data?.data || [];
  const servicePostsMeta = servicePostsRes?.data?.meta || {};

  // Show skeleton for product loading
  if (isServicePostsLoading) {
    return (
      <div className="grid w-full grid-cols-1 md:grid-cols-2 md:gap-7 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, idx) => (
          <ProductCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  return (
    <section className={cn("", className)}>
      <div className="flex-center-between font-dm-sans">
        <p className="max-w-[35%] sm:max-w-[40%] md:max-w-[50%] lg:max-w-[75%]">
          {servicePosts?.length} service{servicePosts?.length > 1 ? "s" : ""}{" "}
          found {searchTerm && `for "${searchTerm}"`} 🌟
        </p>

        {/* Indicators */}
        <div className="flex-center-start gap-x-4">
          {/* Location Indicator */}
          {!geoLocation?.coordinates ? (
            <button
              className="flex-center-start gap-x-1"
              onClick={() => handleShowNearbyResults(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
              >
                <path
                  fill="#ca1717"
                  d="M12 2C7.589 2 4 5.589 4 9.995C3.971 16.44 11.696 21.784 12 22c0 0 8.029-5.56 8-12c0-4.411-3.589-8-8-8m0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4s4 1.79 4 4s-1.79 4-4 4"
                ></path>
              </svg>
              <span className="max-w-32 truncate sm:max-w-56 md:max-w-max">
                Show nearby results
              </span>
            </button>
          ) : (
            <button
              className="flex-center-start gap-x-1 font-dm-sans"
              onClick={() => handleShowNearbyResults(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
              >
                <path
                  fill="#ca1717"
                  d="M12 2C7.589 2 4 5.589 4 9.995C3.971 16.44 11.696 21.784 12 22c0 0 8.029-5.56 8-12c0-4.411-3.589-8-8-8m0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4s4 1.79 4 4s-1.79 4-4 4"
                ></path>
              </svg>
              <span>Show all results</span>
            </button>
          )}
        </div>
      </div>

      {/* Show Selected Category */}
      {selectedCategory?.name && (
        <Button size="sm" variant="blue" className="mt-6 h-7 rounded-full">
          {selectedCategory?.name}{" "}
          <span onClick={() => setSelectedCategory({})}>
            <X />
          </span>
        </Button>
      )}

      {/* Service Posts */}
      {servicePosts?.length > 0 ? (
        <motion.div
          variants={fadeUpWithBlurVariants()}
          initial="initial"
          animate="animate"
          className="mt-6 grid grid-cols-1 gap-y-7 md:grid-cols-2 md:gap-7 2xl:grid-cols-3 2xl:gap-5"
        >
          {servicePosts?.map((servicePost) => (
            <motion.div
              key={servicePost?._id}
              variants={fadeUpWithBlurVariants()}
            >
              <ServicePostCard servicePost={servicePost} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyContainer className="h-[50vh]" />
      )}

      <div className="ml-auto mt-20 w-max">
        <CustomPagination
          total={servicePostsMeta?.total}
          pageSize={servicePostsMeta?.limit}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </section>
  );
}
