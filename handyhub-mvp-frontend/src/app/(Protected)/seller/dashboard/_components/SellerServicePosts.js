"use client";
import serviceBanner1 from "/public/images/services/service-post-1.png";
import serviceBanner2 from "/public/images/services/service-post-2.png";
import serviceBanner3 from "/public/images/services/service-post-3.png";
import authorAvatar from "/public/images/services/avatar.png";
import { motion } from "motion/react";
import ServicePostCard from "@/app/(Public)/services/_components/ServicePostCard";
import { fadeUpWithBlurVariants } from "@/utils/sharedMotionVariants";
import EmptyContainer from "@/components/EmptyContainer/EmptyContainer";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { useGetMyServicePostsQuery } from "@/redux/api/servicePostApi";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/authSlice";
import CustomLoader from "@/components/CustomLoader/CustomLoader";
import CustomPagination from "@/components/CustomPagination/CustomPagination";
import Link from "next/link";

const SERVICE_POSTS = [
  {
    banner: serviceBanner1,
    title: "Smart Home Systems Maintenance",
    summary:
      "As a trusted service provider, I specialize in maintaining and optimizing your smart home systems to ensure they operate seamlessly...",
    tags: ["Smart Home", "Maintenance", "Systems Optimization"],
    author: {
      name: "John Doe",
      avatar: authorAvatar,
      rating: 4.8,
      location: "New York, USA",
    },
  },
  {
    banner: serviceBanner2,
    title: "Solar Panel Repair and Renovation",
    summary:
      " I offer expert solutions to keep your solar panels performing at their best. Whether you’re facing issues like reduced energy output, physical damage, or outdated components, I specialize in diagnosing and repairing all types of solar panel systems....",
    tags: ["Sollar Panel", "Repair", "Renovation"],
    author: {
      name: "John Doe",
      avatar: authorAvatar,
      rating: 4.8,
      location: "New York, USA",
    },
  },
  {
    banner: serviceBanner3,
    title: "Kitchen Appliance Painting",
    summary:
      "Transform your kitchen appliances with my professional painting services! Whether you want to refresh outdated colors, match appliances with your kitchen’s design...",
    tags: ["Kitchen Appliance", "Painting"],
    author: {
      name: "John Doe",
      avatar: authorAvatar,
      rating: 4.8,
      location: "New York, USA",
    },
  },

  {
    banner: serviceBanner1,
    title: "Smart Home Systems Maintenance",
    summary:
      "As a trusted service provider, I specialize in maintaining and optimizing your smart home systems to ensure they operate seamlessly...",
    tags: ["Smart Home", "Maintenance", "Systems Optimization"],
    author: {
      name: "John Doe",
      avatar: authorAvatar,
      rating: 4.8,
      location: "New York, USA",
    },
  },
  {
    banner: serviceBanner2,
    title: "Solar Panel Repair and Renovation",
    summary:
      " I offer expert solutions to keep your solar panels performing at their best. Whether you’re facing issues like reduced energy output, physical damage, or outdated components, I specialize in diagnosing and repairing all types of solar panel systems....",
    tags: ["Sollar Panel", "Repair", "Renovation"],
    author: {
      name: "John Doe",
      avatar: authorAvatar,
      rating: 4.8,
      location: "New York, USA",
    },
  },
];

export default function SellerServicePosts() {
  const userId = useSelector(selectUser)?.userId;
  const [currentPage, setCurrentPage] = useState(1);

  const query = {};
  query["page"] = currentPage;

  // Get service post of the seller
  const { data: myServicePostsRes, isLoading } = useGetMyServicePostsQuery(
    query,
    { skip: !userId },
  );
  const myServicePosts = myServicePostsRes?.data?.data || [];

  return (
    <section className="mt-4 rounded-lg border bg-white p-8 shadow-md">
      {/* Upload Service Post */}
      <Button variant="blue" size="lg" className="w-full rounded-full" asChild>
        <Link href={`/seller/dashboard/create-service-post`}>
          <CirclePlus /> Add Service Post
        </Link>
      </Button>

      {/* Service Posts */}
      {isLoading ? (
        <div className="flex-center h-[50vh]">
          <CustomLoader type="colorful" variant="lg" />;
        </div>
      ) : myServicePosts?.length > 0 ? (
        <>
          <motion.div
            variants={fadeUpWithBlurVariants()}
            initial="initial"
            animate="animate"
            className="mt-6 grid grid-cols-1 gap-y-7 md:grid-cols-2 md:gap-7 2xl:grid-cols-3 2xl:gap-5"
          >
            {myServicePosts?.map((servicePost) => (
              <motion.div
                variants={fadeUpWithBlurVariants()}
                key={servicePost?._id}
              >
                <ServicePostCard
                  servicePost={servicePost}
                  sellerDashboard={true}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          <CustomPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            total={myServicePostsRes?.meta?.total}
            pageSize={myServicePostsRes?.meta?.limit}
          />
        </>
      ) : (
        <EmptyContainer className="flex-center h-[65vh]" />
      )}
    </section>
  );
}
