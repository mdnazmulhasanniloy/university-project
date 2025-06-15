"use client";

import SectionHeader from "@/components/SectionHeader/SectionHeader";
import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import { Button } from "@/components/ui/button";
import AnimatedArrow from "@/components/AnimatedArrow/AnimatedArrow";
import { useGetAllCategoriesQuery } from "@/redux/api/categoryApi";
import CategoryCard from "./CategoryCard";
import { useRouter } from "next/navigation";

export default function Services() {
  const router = useRouter();

  // Get all services
  const { data: categoriesRes, isLoading } = useGetAllCategoriesQuery({
    limit: 7,
  });
  const categories = categoriesRes?.data || [];

  return (
    <ResponsiveContainer className="space-y-12">
      <SectionHeader
        heading="Service Categories"
        subHeading="You have problems with leaking pipes, broken tiles, lost keys or want to tidy up the trees around you, of course you need our help!"
        className="mx-auto w-full text-center"
      />

      <div className="grid grid-cols-1 gap-y-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12 2xl:grid-cols-4">
        {categories?.map((category, idx) => (
          <CategoryCard key={idx} category={category} index={idx} />
        ))}

        {/* More service card */}
        <div className="flex flex-col justify-between rounded-xl bg-primary-black p-4 text-center text-primary-white">
          <>
            <h4 className="text-2xl font-semibold">More Service?</h4>
            <p className="mb-5 mt-1 px-4 font-dm-sans">
              You can tell us what you need and we can help!
            </p>
          </>

          <Button
            className="group w-full rounded-xl bg-white text-black hover:bg-white/90"
            onClick={() => router.push("/services")}
          >
            See More <AnimatedArrow />
          </Button>
        </div>
      </div>
    </ResponsiveContainer>
  );
}
