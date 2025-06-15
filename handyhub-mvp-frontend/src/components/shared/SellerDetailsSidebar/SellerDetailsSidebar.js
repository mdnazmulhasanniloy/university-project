"use client";

import CustomAvatar from "@/components/CustomAvatar/CustomAvatar";
import { Mail } from "lucide-react";
import { Phone } from "lucide-react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessageSquareText } from "lucide-react";
import CustomTooltip from "@/components/CustomTooltip/CustomTooltip";
import { LogOut } from "lucide-react";
import { SuccessModal } from "@/utils/customModal";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout, selectUser } from "@/redux/features/authSlice";
import { format, formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";
import { useGetProfileQuery } from "@/redux/api/userApi";
import placeholderBannerBg from "/public/images/placeholder-bg.svg";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import Link from "next/link";
import getGoogleMapsLink from "@/utils/getGoogleMapsLink";

export default function SellerDetailsSidebar({
  sellerDashboard,
  sellerProfileData = {},
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userId, role } = useSelector(selectUser) ?? {};
  const [sellerDetails, setSellerDetails] = useState(sellerProfileData);

  // Get seller profile
  const { data: sellerProfileRes, isLoading } = useGetProfileQuery(
    {},
    { skip: !userId || role !== "seller" },
  );

  // Set seller details based on page
  // meaning, since seller sidebar is both on service post page and seller dashboard,
  // so, we need to set seller details based on page
  useEffect(() => {
    if (!sellerProfileData?._id) {
      setSellerDetails(sellerProfileRes);
    } else {
      setSellerDetails(sellerProfileData);
    }
  }, [sellerProfileData, sellerProfileRes]);

  // Get seller profile
  const handleLogout = () => {
    dispatch(logout());

    SuccessModal("Logout Successful!");
    router.refresh();
    router.push("/login");
  };

  return (
    <div className="relative w-full rounded-lg border bg-foundation-primary-white-light pb-5 shadow">
      <div
        className={`relative h-[200px] rounded-t-lg`}
        style={{
          backgroundImage: `url(${sellerDetails?.banner || placeholderBannerBg.src})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        {isLoading ? (
          <div>
            <div
              style={{
                borderRadius: "50%",
                display: "inline-block",
                borderTop: "1.5px solid gray",
                borderRight: "1.5px solid transparent",
                boxSizing: "border-box",
                animation: "rotation 1s linear infinite",
              }}
              className="absolute -bottom-14 left-4 size-28"
            />
            <Skeleton className="absolute -bottom-14 left-4 size-28 rounded-full" />
          </div>
        ) : (
          <CustomAvatar
            img={sellerDetails?.profile}
            name={sellerDetails?.name}
            className={cn(
              "absolute -bottom-16 left-4 size-32 text-3xl ring-2 ring-white ring-offset-2 ring-offset-transparent",
              !sellerDetails?.profile &&
                `bg-[${sellerDetails?.bannerColor}] text-white`,
            )}
          />
        )}
      </div>

      {/* placeholder div ---- edit + logout buttons */}
      {!sellerDashboard ? (
        <div className="h-[80px] w-full" />
      ) : (
        <div className="flex-start-end h-[80px] w-full gap-x-2 px-3 py-2">
          <CustomTooltip title="Logout">
            <Button
              variant="destructive"
              size="icon"
              className="w-full rounded-full px-5"
              onClick={handleLogout}
            >
              Logout <LogOut />
            </Button>
          </CustomTooltip>
        </div>
      )}

      <div className="px-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="ml-5 h-4 w-10/12 rounded-full" />
            <Skeleton className="ml-5 h-4 w-7/12 rounded-full" />
            <Skeleton className="ml-5 h-4 w-1/2 rounded-full" />
            <Skeleton className="ml-5 h-4 w-3/4 rounded-full" />
          </div>
        ) : (
          <div>
            <p className="mb-2 block text-2xl font-extrabold">
              {sellerDetails?.name}
            </p>

            <div className="space-y-2">
              <p className="flex-center-start gap-x-3 font-dm-sans text-black/75">
                <Mail size={18} /> {sellerDetails?.email}
              </p>
              <p className="flex-center-start gap-x-3 font-dm-sans text-black/75">
                <Phone size={18} /> {sellerDetails?.phoneNumber || "--"}
              </p>
              <p className="flex-center-start gap-x-3 font-dm-sans text-black/75">
                <MapPin size={18} />

                {sellerDetails?.location?.coordinates?.length > 0 ? (
                  <Link
                    href={getGoogleMapsLink(
                      sellerDetails?.location?.coordinates[1],
                      sellerDetails?.location?.coordinates[0],
                    )}
                    target="_blank"
                  >
                    {sellerDetails?.address || "--"}
                  </Link>
                ) : (
                  sellerDetails?.address || "--"
                )}
              </p>
            </div>
          </div>
        )}

        {!sellerDashboard && (
          <Button variant="blue" className="mt-4" asChild>
            <Link href={`/messages?user=${sellerDetails?._id}`}>
              <MessageSquareText size={18} /> Message
            </Link>
          </Button>
        )}
        {/* Insights */}
        <div className="mt-7">
          <h2 className="mb-3 text-2xl font-semibold text-primary-orange">
            Insights
          </h2>

          <div className="space-y-2">
            <div className="flex-center-between font-dm-sans text-primary-black">
              <p>Running Jobs</p>
              <p>{sellerDetails?.pendingWork}</p>
            </div>
            <div className="flex-center-between font-dm-sans text-primary-black">
              <p>Last Quoted</p>
              <p>
                {sellerDetails?.lastQuote
                  ? formatDistanceToNow(sellerDetails?.lastQuote, {
                      addSuffix: true,
                    })
                  : "--"}
              </p>
            </div>
            <div className="flex-center-between font-dm-sans text-primary-black">
              <p>Avg Response Time</p>
              <p>
                {sellerDetails?.averageResponseTime === 0
                  ? "> 1"
                  : Math.round(sellerDetails?.averageResponseTime / 60)}{" "}
                min
              </p>
            </div>
            <div className="flex-center-between font-dm-sans text-primary-black">
              <p>Member Since</p>
              <p>
                {sellerDetails?.createdAt &&
                  format(sellerDetails?.createdAt, "MMM dd, yyyy")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
