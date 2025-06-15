"use client";

import { Badge, Button } from "antd";
import { Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Layout } from "antd";
import { AlignJustify } from "lucide-react";
import { useSelector } from "react-redux";
import { useGetProfileQuery } from "@/redux/api/userApi";
import { useEffect } from "react";
import { socket } from "@/socket";
import toast from "react-hot-toast";
import { useGetMyNotificationQuery } from "@/redux/api/notificationApi";
const { Header } = Layout;

export default function HeaderContainer({ collapsed, setCollapsed }) {
  const pathname = usePathname();
  const navbarTitle = pathname.split("/admin")[1];
  const { data: notificationData, refetch } = useGetMyNotificationQuery({
    read: false,
  });

  const router = useRouter();
  const userId = useSelector((state) => state.auth?.user?.userId);
  const token = useSelector((state) => state.auth?.token);

  const notification = useSelector((state) => state.notification.notification);

  useEffect(() => {
    if (notification?.message) {
      toast.info(notification?.message);
    }
  }, [notification]);

  //socket
  useEffect(() => {
    socket.auth = { token };
    socket.connect();
    const handleNotificationEvent = (data) => {
      if (data) {
        refetch();
        data = null;
      }
    };

    socket.on("notification::" + userId, handleNotificationEvent);

    return () => {
      // Clean up the event listener when the component is unmounted
      socket.off(userId, handleNotificationEvent);
      socket.disconnect();
    };
  }, [userId, refetch, token]);

  if (!userId) {
    router.push("/login");
  }
  // Get user info
  const { data: userRes, refetch: userRefetch } = useGetProfileQuery(null, {
    skip: !userId,
  });

  const user = userRes?.data || {};

  return (
    <Header
      style={{
        backgroundColor: "var(--primary-orange-light)",
        height: "80px",
        display: "flex",
        alignItems: "center",
        alignItems: "center",
        justifyContent: "space-between",
        paddingInline: 0,
        paddingRight: "40px",
      }}
    >
      {/* Collapse Icon */}
      <div className="flex gap-x-2">
        <button
          className="rounded-md p-1 transition-all duration-300 ease-in-out hover:bg-black/10"
          onClick={() => setCollapsed(!collapsed)}
        >
          <AlignJustify strokeWidth={3} size={25} />
        </button>

        <h1 className="font-dmSans text-3xl font-semibold capitalize">
          {navbarTitle.length > 1
            ? navbarTitle.replaceAll("/", " ").replaceAll("-", " ")
            : "dashboard"}
        </h1>
      </div>

      {/* Right --- notification, user profile */}
      <div className="flex items-center gap-x-6">
        <Link href="/admin/notification" className="relative !leading-none">
          <Badge count={notificationData?.data?.length || 0} overflowCount={10}>
            <Bell
              className="text-orange cursor-pointer rounded-full"
              fill="#1C1B1F"
              stroke="#1C1B1F"
              size={22}
            />
          </Badge>
        </Link>

        {/* User */}
        <Link
          href={"/admin/profile"}
          className="group flex items-center gap-x-2 text-black hover:text-primary-blue"
        >
          {user.profile ? (
            <Image
              src={user?.profile}
              alt="Admin avatar"
              width={52}
              height={52}
              className="h-[50px] w-[50px] rounded-full border-2 border-primary-green p-0.5 group-hover:border"
            />
          ) : (
            <div className="font-500 flex size-10 items-center justify-center rounded-full bg-white">
              <p className="text-16">
                {user?.name?.slice(0, 2)?.toUpperCase()}
              </p>
            </div>
          )}

          <h4 className="text-lg font-semibold">{user?.name}</h4>
        </Link>
      </div>
    </Header>
  );
}
