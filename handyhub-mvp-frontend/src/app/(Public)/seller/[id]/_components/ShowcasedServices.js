import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ServicePostCard from "@/app/(Public)/services/_components/ServicePostCard";
import { useGetAllServicePostsQuery } from "@/redux/api/servicePostApi";

export function ShowcasedServices({ id: serviceProviderId }) {
  const { data: servicePostsRes, isLoading } = useGetAllServicePostsQuery(
    { serviceProvider: serviceProviderId, limit: 999999 },
    { skip: !serviceProviderId },
  );
  const servicePosts = servicePostsRes?.data?.data || [];

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Showcased Services
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {servicePosts?.map((service) => (
            <ServicePostCard
              key={service?._id}
              servicePost={service}
              sellerPage={true}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
