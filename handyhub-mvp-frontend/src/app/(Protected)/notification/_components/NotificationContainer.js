"use client";

import { cn } from "@/lib/utils";
import { BellDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";
import { Trash2 } from "lucide-react";
import {
  useGetAllNotificationsQuery,
  useReadAllNotificationMutation,
  useRemoveNotificationsMutation,
} from "@/redux/api/notificationApi";
import { formatDistanceToNow } from "date-fns";
import NotificationsSkeleton from "./NotificationSkeleton";
import { ConfirmModal, ErrorModal } from "@/utils/customModal";
import { successToast } from "@/utils/customToast";
import { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketContextApi";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/authSlice";
import EmptyContainer from "@/components/EmptyContainer/EmptyContainer";
import CustomPagination from "@/components/CustomPagination/CustomPagination";
import { useRouter } from "next/navigation";

export default function NotificationsContainer() {
  const { socket } = useSocket();
  const userId = useSelector(selectUser)?.userId;
  const role = useSelector(selectUser)?.role;
  const router = useRouter();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const query = {};
  query["page"] = currentPage;
  query["limit"] = pageSize;

  // Get all notifications
  const {
    data: notificationsRes,
    isLoading: isNotificationLoading,
    refetch,
  } = useGetAllNotificationsQuery(query);
  const notifications = notificationsRes?.data || [];
  const meta = notificationsRes?.meta || {};

  // Listen to notification socket api for new notification
  const handleNewNotification = async (res) => {
    if (res) {
      refetch();
    }
  };

  useEffect(() => {
    if (socket && userId) {
      socket.emit("message-notification", {});
    }
  }, [socket, userId]);

  useEffect(() => {
    if (socket && userId) {
      socket.on(`notification::${userId}`, handleNewNotification);
    }

    return () => {
      socket?.off(`notification::${userId}`, handleNewNotification);
    };
  }, [socket, userId]);

  // Set notification as read
  const [markNotificationAsRead, { isLoading: isMarkNotificationLoading }] =
    useReadAllNotificationMutation();

  const handleReadNotifications = async () => {
    try {
      await markNotificationAsRead().unwrap();
    } catch (error) {
      ErrorModal(error?.data?.message || error?.message);
    }
  };

  // Clear notifications
  const [removeNotifications, { isLoading: isRemoveNotificationLoading }] =
    useRemoveNotificationsMutation();

  const handleRemoveNotifications = async () => {
    ConfirmModal(
      "Clear Notifications?",
      "All notifications will be cleared",
    ).then(async (res) => {
      if (res?.isConfirmed) {
        try {
          await removeNotifications().unwrap();
          successToast("Notifications cleared successfully");
        } catch (error) {
          ErrorModal(error?.data?.message || error?.message);
        }
      }
    });
  };

  if (isNotificationLoading) {
    return <NotificationsSkeleton />;
  }

  if (notifications?.length === 0 && !isNotificationLoading) {
    return (
      <EmptyContainer message="No notifications found!!" className="my-40" />
    );
  }

  return (
    <section>
      <div className="flex-center-between mb-8 flex-col space-y-4 lg:flex-row">
        <h2 className="text-3xl font-semibold">My Notifications</h2>

        <div className="space-x-5">
          <Button
            variant="blue"
            onClick={handleReadNotifications}
            loading={isMarkNotificationLoading}
            loaderSize={20}
          >
            Mark as Read <CheckCheck size={18} />
          </Button>

          <Button
            variant="destructive"
            onClick={handleRemoveNotifications}
            loading={isRemoveNotificationLoading}
            loaderSize={20}
          >
            Clear Notifications <Trash2 size={18} />
          </Button>
        </div>
      </div>

      <div className="space-y-5">
        {notifications?.map((notification) => (
          <div
            key={notification?._id}
            className={cn(
              "my-2 flex items-center gap-x-5 rounded-md px-4 py-4",
              !notification?.read
                ? "bg-gray-100"
                : "border border-slate-300 bg-white",
            )}
            role={notification?.model_type === "Contract" && "button"}
            onClick={() => {
              if (notification?.model_type === "Contract") {
                if (role === "customer") {
                  router.push(`/customer/dashboard`);
                } else {
                  router.push(`/seller/dashboard?activeTab=contractRequests`);
                }
              }
            }}
          >
            <div>
              <BellDot size={24} className="block" />
            </div>

            <div>
              <div className="flex items-start gap-x-10 lg:items-center lg:gap-x-4">
                {/* title and date */}
                <h5 className="mb-1 text-base font-medium md:text-xl">
                  {notification?.message}
                </h5>

                <div className="hidden h-1 w-1 rounded-full bg-black lg:block" />

                <p className="font-dm-sans text-sm text-black/80">
                  {notification?.createdAt &&
                    formatDistanceToNow(notification?.createdAt, {
                      addSuffix: true,
                    })}
                </p>
              </div>

              {/* message */}
              <p className="mt-1 font-dm-sans text-black/75">
                {notification?.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <CustomPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        total={meta.total}
        pageNeighbors={1}
      />
    </section>
  );
}
