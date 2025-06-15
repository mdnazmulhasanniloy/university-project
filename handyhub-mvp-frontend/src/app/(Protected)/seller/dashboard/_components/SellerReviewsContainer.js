"use client";

import { Star, StarHalf } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import CustomStarRating from "@/components/CustomStarRating/CustomStarRating";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/authSlice";
import { useGetServiceProviderReviewsQuery } from "@/redux/api/reviewApi";
import { useGetProfileQuery } from "@/redux/api/userApi";
import { useState } from "react";
import CustomAvatar from "@/components/CustomAvatar/CustomAvatar";
import { format } from "date-fns";
import CustomLoader from "@/components/CustomLoader/CustomLoader";
import CustomPagination from "@/components/CustomPagination/CustomPagination";

export default function SellerReviewsContainer() {
  const userId = useSelector(selectUser)?.userId;
  const [currentPage, setCurrentPage] = useState(1);

  const query = {};
  query["page"] = currentPage;
  query["serviceProvider"] = userId;

  // Get profile
  const { data: profile } = useGetProfileQuery({}, { skip: !userId });

  // Get all reviews of the service provider
  const { data: serviceProviderReviewsRes, isLoading } =
    useGetServiceProviderReviewsQuery(query, { skip: !userId });
  const serviceProviderReviews = serviceProviderReviewsRes?.data || [];
  const serviceProviderReviewsMeta = serviceProviderReviewsRes?.meta || {};

  if (isLoading) {
    return (
      <div className="flex-center h-[50vh]">
        <CustomLoader type="colorful" variant="lg" />
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-lg border bg-white p-8 shadow-md">
      <div className="space-y-8">
        <div className="flex flex-col items-start gap-8">
          {/* Rating Summary */}
          <div className="flex-center w-full gap-x-10 space-y-6">
            <div className="w-1/4 text-center md:text-left">
              <h2 className="text-center text-5xl font-bold">
                {profile?.avgRating}
              </h2>

              <div className="mx-auto max-w-max">
                <CustomStarRating rating={profile?.avgRating} />
              </div>

              <p className="text-muted-foreground mt-1 text-center font-dm-sans text-sm">
                {serviceProviderReviewsMeta.total} reviews
              </p>
            </div>

            {/* Note: Don't remove this part. Api is not ready yet!! */}
            {/* 
            <div className="w-1/2 space-y-2">
              {stats.distribution.map(({ stars, count }) => (
                <div key={stars} className="flex items-center gap-2">
                  <div className="w-8 text-base font-medium">{stars}</div>
                  <Progress
                    value={(count / stats.total) * 100}
                    className="h-2"
                    lineClassName="bg-primary-orange"
                  />
                  <div className="text-muted-foreground w-12 text-center text-sm">
                    ({count})
                  </div>
                </div>
              ))}
            </div> */}
          </div>

          {/* Reviews List */}
          <section className="w-full">
            <div className="w-full flex-1 space-y-4">
              {serviceProviderReviews?.map((review, index) => (
                <Card key={index} className="!max-w-full">
                  <CardContent className="!max-w-full p-6">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex gap-3">
                        <CustomAvatar
                          img={review?.user?.profile}
                          name={review?.user?.name}
                          className="size-12"
                        />

                        <div className="font-dm-sans">
                          <div className="font-semibold">
                            {review?.user?.name}
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {review?.user?.address || "--"}
                          </div>
                        </div>
                      </div>

                      <div className="text-muted-foreground text-sm">
                        {review.createdAt &&
                          format(review.createdAt, "MMM dd, yyyy")}
                      </div>
                    </div>

                    <div className="mb-3 flex gap-1">
                      <CustomStarRating rating={review?.rating} />
                    </div>

                    <p className="text-muted-foreground font-medium leading-relaxed">
                      {review?.comment}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {serviceProviderReviewsMeta?.total >
              serviceProviderReviewsMeta?.limit && (
              <div className="ml-auto max-w-max">
                <CustomPagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  total={serviceProviderReviewsMeta?.total}
                  pageSize={serviceProviderReviewsMeta?.limit}
                />
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
