import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import sellerAvatar from "/public/images/seller/seller-avatar.jpg";
import { MapPin } from "lucide-react";
import AnimatedArrow from "@/components/AnimatedArrow/AnimatedArrow";
import { LucidePhoneCall } from "lucide-react";
import { Mail } from "lucide-react";
import CustomAvatar from "@/components/CustomAvatar/CustomAvatar";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import Link from "next/link";
import getGoogleMapsLink from "@/utils/getGoogleMapsLink";

export function ProfileHeader({ seller }) {
  return (
    <Card className="border-none shadow-none">
      <CardContent>
        <div className="flex flex-col items-start gap-6 md:flex-row">
          <div className="flex items-start gap-4">
            <CustomAvatar
              img={seller?.profile}
              name={seller?.name}
              className={cn("size-24 text-xl")}
              bannerColor={seller?.bannerColor}
            />

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{seller?.name}</h1>
                <div className="flex items-center text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-muted-foreground ml-1 text-sm">
                    {seller?.avgRating} ({seller?.reviews?.length})
                  </span>
                </div>
              </div>

              <div className="text-muted-foreground !mt-2 space-y-2 font-dm-sans text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-muted" />

                  {seller?.location?.coordinates?.length > 0 && (
                    <Link
                      href={getGoogleMapsLink(
                        seller?.location?.coordinates[1],
                        seller?.location?.coordinates[0],
                      )}
                      target="_blank"
                    >
                      {seller?.address || "--"}
                    </Link>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-muted" />
                  <span>{seller?.email}</span>
                </div>

                <div className="flex items-center gap-2">
                  <LucidePhoneCall className="size-4 text-muted" />
                  <span>{seller?.phoneNumber}</span>
                </div>
              </div>

              <Button variant="blue" className="group !mt-6" size="sm" asChild>
                <Link href={`/messages?user=${seller?._id}`}>
                  Message <AnimatedArrow />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-4 lg:ml-auto lg:w-max lg:text-right">
            <div>
              <h4 className="font-dm-sans font-semibold">Avg Response Time</h4>
              <p className="text-muted-foreground">
                {seller?.averageResponseTime === 0
                  ? "> 1"
                  : Math.round(seller?.averageResponseTime / 60)}{" "}
                min
              </p>
            </div>

            <div>
              <h4 className="font-dm-sans font-semibold">Last Quoted</h4>
              <p>
                {seller?.lastQuote
                  ? formatDistanceToNow(seller?.lastQuote, {
                      addSuffix: true,
                    })
                  : "--"}
              </p>
            </div>

            <div>
              <h4 className="font-dm-sans font-semibold">Running Work</h4>
              <p>{seller?.pendingWork}</p>
            </div>

            <div>
              <h4 className="font-dm-sans font-semibold">Member Since</h4>
              <p className="text-muted-foreground">
                {seller?.createdAt && format(seller?.createdAt, "MMM dd, yyyy")}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
