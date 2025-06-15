"use client";
import userAvatar from "@/assets/images/user-avatar-lg.png";
import NotificationCard from "./NotificationCard";
import { Button, Empty } from "antd";
import {
  useDeleteNotificationMutation,
  useGetMyNotificationQuery,
  useMarkAsReadMutation,
} from "@/redux/api/notificationApi";
import { ErrorModal, SuccessModal } from "@/utils/modalHook";

export default function NotificationContainer() {
  const {
    data: notificationRes,
    refetch,
    isLoading,
  } = useGetMyNotificationQuery({});
  const [deleteFn] = useDeleteNotificationMutation();
  const [updateNotification] = useMarkAsReadMutation();
  const notificationData = notificationRes?.data || [];

  const handelToRead = async () => {
    try {
      await updateNotification({}).unwrap();
      SuccessModal("All Notification successfully read");
    } catch (error) {
      ErrorModal(error?.message || error?.data?.message);
    }
  };
  const handelToDelete = async () => {
    try {
      await deleteFn({}).unwrap();
      SuccessModal("All Notification successfully deleted");
    } catch (error) {
      ErrorModal(error?.message || error?.data?.message);
    }
  };
  return (
    <div className="w-3/4 mx-auto mb-10">
      <section className="mb-10 flex-center-between">
        <h4 className="text-3xl font-semibold">Notifications</h4>

        <div className="space-x-3">
          <Button type="primary" onClick={handelToRead}>
            Mark as read
          </Button>
          <Button className="!bg-danger !text-white" onClick={handelToDelete}>
            Delete all
          </Button>
        </div>
      </section>

      <section className="space-y-8">
        {notificationData?.length > 0 ? (
          notificationData?.map((notification) => (
            <NotificationCard
              key={notification.key}
              notification={notification}
            />
          ))
        ) : (
          <Empty />
        )}
      </section>
    </div>
  );
}
