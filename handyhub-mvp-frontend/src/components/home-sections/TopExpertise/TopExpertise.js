"use client";
import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import ExpertCard from "./ExpertCard";
import { useGetAllUsersQuery } from "@/redux/api/userApi";
import ExpertCardSkeleton from "./ExpertCardSkeleton";

export default function TopExpertise() {
  // Get top experts
  const { data: topExpertsRes, isLoading } = useGetAllUsersQuery({
    limit: 10,
    role: "seller",
    sort: "-finishedWork",
  });
  const topExperts = topExpertsRes?.data?.data || [];

  return (
    <ResponsiveContainer className="space-y-12">
      <SectionHeader
        heading="Top Expertise"
        subHeading="Discover Our Proven Track Record Across Key Domains – Where Innovation Meets Excellence in Delivering Tailored Solutions for Your Needs"
        className="text-center"
      />

      {isLoading ? (
        <ExpertCardSkeleton />
      ) : (
        <div className="relative">
          <Carousel
            opts={{
              loop: false,
              duration: 45,
              align: "start",
            }}
            plugins={[
              Autoplay({
                delay: 3700,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
          >
            <CarouselContent className="-ml-5 px-1 py-2">
              {topExperts?.map((expert) => (
                <CarouselItem
                  key={expert?._id}
                  className="pl-5 sm:basis-1/2 lg:basis-1/3 2xl:basis-1/4"
                >
                  <ExpertCard expert={expert} />
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="hidden lg:block">
              <CarouselPrevious
                className="-left-14 size-12 bg-primary-blue text-white"
                iconClassName="!size-5"
              />
              <CarouselNext
                className="-right-14 size-12 bg-primary-blue text-white"
                iconClassName="!size-5"
              />
            </div>

            <div className="absolute -bottom-8 left-1/2">
              <CarouselDots />
            </div>
          </Carousel>
        </div>
      )}
    </ResponsiveContainer>
  );
}
