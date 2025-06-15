"use client";

import CustomAvatar from "@/components/CustomAvatar/CustomAvatar";
import { Mail } from "lucide-react";
import { Phone } from "lucide-react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserRoundPen } from "lucide-react";
import CustomTooltip from "@/components/CustomTooltip/CustomTooltip";
import { useContext } from "react";
import { CustomerDashboardContext } from "@/context/CustomerDashboardContext";
import { LogOut } from "lucide-react";
import { SuccessModal } from "@/utils/customModal";
import { useRouter } from "next/navigation";
import { useGetProfileQuery } from "@/redux/api/userApi";
import { useSelector } from "react-redux";
import { logout, selectUser } from "@/redux/features/authSlice";
import placeholderBannerBg from "/public/images/placeholder-bg.svg";
import { useDispatch } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function CustomerProfileSidebar() {
  const { setSelectedTab } = useContext(CustomerDashboardContext);
  const router = useRouter();
  const dispatch = useDispatch();
  const { userId, role } = useSelector(selectUser) ?? {};

  // Get user profile
  const { data: profile, isLoading } = useGetProfileQuery(
    {},
    { skip: !userId || role !== "customer" },
  );

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
          backgroundImage: `url(${profile?.banner || placeholderBannerBg.src})`,
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
            img={profile?.profile}
            name={profile?.name}
            className={cn(
              "absolute -bottom-16 left-4 size-32 text-3xl ring-2 ring-white ring-offset-2 ring-offset-transparent",
              !profile?.profile && `bg-[${profile?.bannerColor}] text-white`,
            )}
          />
        )}
      </div>

      {/* placeholder div ---- edit + delete buttons */}
      <div className="flex-start-end h-[80px] w-full gap-x-2 p-2">
        <CustomTooltip title="Update Profile">
          <Button
            variant="blue"
            size="icon"
            className="rounded-full"
            onClick={() => setSelectedTab("settings")}
          >
            <UserRoundPen />
          </Button>
        </CustomTooltip>

        <CustomTooltip title="Logout">
          <Button
            variant="destructive"
            size="icon"
            className="rounded-full"
            onClick={handleLogout}
          >
            <LogOut />
          </Button>
        </CustomTooltip>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="ml-5 h-4 w-10/12 rounded-full" />
          <Skeleton className="ml-5 h-4 w-7/12 rounded-full" />
          <Skeleton className="ml-5 h-4 w-1/2 rounded-full" />
          <Skeleton className="ml-5 h-4 w-3/4 rounded-full" />
        </div>
      ) : (
        <div className="px-4">
          <p className="mb-2 block text-2xl font-extrabold">{profile?.name}</p>

          <div className="space-y-2">
            <p className="flex-center-start gap-x-3 font-dm-sans text-black/75">
              <Mail size={18} /> {profile?.email}
            </p>
            <p className="flex-center-start gap-x-3 font-dm-sans text-black/75">
              <Phone size={18} /> {profile?.phoneNumber || "--"}
            </p>
            <p className="flex-center-start gap-x-3 font-dm-sans text-black/75">
              <MapPin size={18} /> {profile?.address || "--"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
