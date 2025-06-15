import { Bell } from "lucide-react";
import moment from "moment";

export default function NotificationCard({ notification }) {
  return (
    <div
      className={`flex items-center justify-between gap-x-5 rounded-xl px-4 py-5 ${
        notification?.read
          ? "border border-primary-orange bg-white"
          : "bg-primary-orange-light"
      } `}
    >
      <Bell size={32} />

      <div>
        <p className="text-[22px] text-xl font-semibold">
          {notification?.message}
        </p>
        <p className="text-md"> {notification?.description}</p>
      </div>

      <p className="text-dark ml-3 font-bold">
        {moment(notification?.createdAt).startOf("hour").fromNow()}
      </p>
    </div>
  );
}
