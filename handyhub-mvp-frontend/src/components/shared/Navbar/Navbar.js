/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image"; 
import logo from "/public/logos/logo-svg.svg";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlignJustify, MessageSquareText, Bell } from "lucide-react";
import AnimatedArrow from "@/components/AnimatedArrow/AnimatedArrow";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import CustomAvatar from "@/components/CustomAvatar/CustomAvatar";
import AnimateTextOnHover from "@/components/AniamteTextOnHover/AnimateTextOnHover";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/authSlice";
import { useGetProfileQuery } from "@/redux/api/userApi";
import defaultUserAvatar from "/public/images/user/default-user-avatar.png";
import { useSocket } from "@/context/SocketContextApi";
import { tagTypes } from "@/redux/tagtypes";
import useRefetchOnMessage from "@/hooks/useRefetchOnNotificaitonFound";
import MobileSidebar from "./MobileSidebar";

// Links
const LINKS = [
  {
    key: "home",
    label: "Home",
    route: "/",
  },

  {
    key: "services",
    label: "Services",
    route: "/services",
  },
  // {
  //   key: "about",
  //   label: "About us",
  //   route: "/about",
  // },
  {
    key: "contact",
    label: "Contact Us",
    route: "/contact",
  },
];

export default function Navbar() {
  const userId = useSelector(selectUser)?.userId;
  const role = useSelector(selectUser)?.role;

  const { socket } = useSocket();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const pathName = usePathname();
  const { handleInvalidateTags } = useRefetchOnMessage();
  const [isUnreadMessageFound, setIsUnreadMessageFound] = useState(false);
  const [isUnreadNotificationFound, setIsUnreadNotificationFound] =
    useState(false);
  const router = useRouter();

  // Get current pathname for creating active link
  const currentPath = usePathname();

  // ============== Get User Profile Info ====================
  const { data: userProfile } = useGetProfileQuery(null, { skip: !userId });

  const handleNewMessageNotification = async (unreadMessageCount) => {
    if (currentPath === "/messages") {
      setIsUnreadMessageFound(false);
    }

    if (unreadMessageCount > 0) {
      setIsUnreadMessageFound(true);
    }
  };

  useEffect(() => {
    if (socket && userId) {
      socket.on(`new-notifications::${userId}`, handleNewMessageNotification);
    }

    return () => {
      socket?.off(`new-notifications::${userId}`, handleNewMessageNotification);
    };
  }, [socket, userId]);

  useEffect(() => {
    if (socket && userId) {
      socket.emit("message-notification", {});
    }
  }, [socket, userId]);

  useEffect(() => {
    if (currentPath === "/messages") {
      setIsUnreadMessageFound(false);
    }
  }, [currentPath]);

  // Listen for all notification
  const handleNotification = async (res) => {
    if (res) {
      setIsUnreadNotificationFound(true);

      toast.info(res?.message, {
        duration: 2200,
        position: "top-center",
        action: {
          label: "See Details",
          onClick: () => router.push("/notification"),
        },
      });

      // This function will invalidate all get apis
      // that needs to be updated on notification receive
      handleInvalidateTags([
        tagTypes.notifications,
        tagTypes.contracts,
        tagTypes.contract,
        tagTypes.reviews,
      ]);
    }
  };
  useEffect(() => {
    if (socket && userId) {
      socket.on(`notification::${userId}`, handleNotification);
    }

    return () => {
      socket?.off(`notification::${userId}`, handleNotification);
    };
  }, [socket, userId]);

  useEffect(() => {
    if (currentPath === "/notification") {
      setIsUnreadNotificationFound(false);
    }
  }, [currentPath]);

  return (
    <header className="my-8">
      {/* -------------- Desktop Version ------------- */}

      <nav className="primary-gradient mx-auto hidden h-[90px] rounded-full p-[1px] shadow lg:block lg:w-[90%] 2xl:w-3/4">
        <div className="items-center justify-between w-full h-full px-8 mx-auto border rounded-full bg-primary-white lg:flex">
          {/* Left ----- Logo */}
          <Link href="/" className="w-1/4 overflow-hidden">
            <Image
              src={logo}
              alt="Logo of Handyhub"
              className="w-full h-12 3xl:-translate-x-16"
            />
          </Link>

          {/* Center ------ Links */}
          <div className="flex items-center justify-center flex-grow gap-x-10">
            {LINKS.map((link) => (
              <Link
                key={link.key}
                href={link.route}
                className="text-lg font-medium text-primary-black"
              >
                <AnimateTextOnHover path={link.route}>
                  {link.label}
                </AnimateTextOnHover>
              </Link>
            ))}
          </div>

          {/* Right -------- User sign up */}
          <div className="flex items-center justify-end w-1/5">
            {userId ? (
              <div className="flex items-center gap-x-6">
                {/* Notification */}
                <Link href="/notification" className="relative pt-1">
                  {isUnreadNotificationFound && (
                    <Badge className="ping absolute -right-1 top-0 aspect-square !h-3 !w-3 rounded-full bg-red-600 !p-0 hover:bg-red-600" />
                  )}
                  <Bell className="size-5 text-primary-black/90 md:size-6" />
                </Link>

                {/* Message */}
                <Link href="/messages" className="relative pt-1">
                  {isUnreadMessageFound && (
                    <Badge className="ping absolute -right-1 top-0 aspect-square !h-3 !w-3 rounded-full bg-red-600 !p-0 hover:bg-red-600" />
                  )}
                  <MessageSquareText className="size-5 text-primary-black/90 md:size-6" />
                </Link>

                {/* ---------- User profile --------------- */}
                <Link href={`/${role}/dashboard`}>
                  <CustomAvatar
                    img={userProfile?.profile || defaultUserAvatar}
                    name={userProfile?.name}
                    className="size-9 ring-2 ring-primary-orange ring-offset-1 duration-300 animate-in hover:scale-[0.98]"
                  />
                </Link>
              </div>
            ) : (
              <div className="w-full flex-center gap-x-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="hidden w-1/2 text-black bg-transparent rounded-full xl:inline-flex"
                  asChild
                >
                  <Link
                    href="/login"
                    className="flex items-center w-full transition-all duration-200 group gap-x-1"
                  >
                    Login
                  </Link>
                </Button>

                <Button
                  variant="orange"
                  size="lg"
                  className="w-1/2 rounded-full"
                  asChild
                >
                  <Link
                    href="/sign-up"
                    className="flex items-center w-full transition-all duration-200 group gap-x-1"
                  >
                    Sign Up
                    <AnimatedArrow arrowSize={17} />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile & Tablet Version */}
      <>
        <nav className="primary-gradient mx-auto block h-14 w-[95%] rounded-full p-[1px] md:h-16 lg:hidden">
          <div className="w-full h-full px-4 rounded-full flex-center-between bg-primary-white">
            {/* Left - Menu Icon */}
            <div className="w-1/4 h-full">
              <button
                className="flex items-center h-full w-max"
                onClick={() => setShowMobileSidebar(true)}
              >
                <AlignJustify size={21} />
              </button>
            </div>

            {/* Center - Logo */}
            <Link href="/" className="flex-grow h-full flex-center md:p-8">
              <Image
                src={logo}
                alt="Official logo of Handyhub"
                className="h-16 w-[60%]"
              />
            </Link>

            {/* Right */}
            <div className="flex items-center justify-end w-1/3 h-full pt-1">
              {userId ? (
                <div className="flex items-center gap-x-3">
                  <Link href="/notification" className="relative pt-1">
                    {isUnreadNotificationFound && (
                      <Badge className="ping absolute -right-1 top-0 aspect-square !h-3 !w-3 rounded-full bg-red-600 !p-0 hover:bg-red-600" />
                    )}

                    <Bell className="size-5 md:size-6" />
                  </Link>

                  {/* Message */}
                  <Link href="/messages" className="relative pt-1">
                    {isUnreadMessageFound && (
                      <Badge className="ping absolute -right-1 top-0 aspect-square !h-3 !w-3 rounded-full bg-red-600 !p-0 hover:bg-red-600" />
                    )}
                    <MessageSquareText className="size-5 md:size-6" />
                  </Link>

                  {/* ---------- User profile --------------- */}
                  <Link href={`/${role}/dashboard`}>
                    <CustomAvatar
                      img={userProfile?.profile || defaultUserAvatar}
                      name={userProfile?.name}
                      className="size-9 ring-2 ring-primary-orange ring-offset-1 duration-300 animate-in hover:scale-[0.98]"
                    />
                  </Link>
                </div>
              ) : (
                <Button
                  size="lg"
                  variant="orange"
                  className="w-3/4 py-4 ml-auto rounded-full"
                  asChild
                >
                  <Link
                    href="/sign-up"
                    className="flex items-center transition-all duration-200 group gap-x-1"
                  >
                    Sign Up
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </nav>

        {/* Mobile Sidebar */}
        <MobileSidebar
          open={showMobileSidebar}
          setOpen={setShowMobileSidebar}
        />
      </>
    </header>
  );
}
