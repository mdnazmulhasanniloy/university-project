import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import NotificationsContainer from "./_components/NotificationContainer";

export const metadata = {
  title: "Notifications",
  description: "User Notifications page",
};

export default function NotificationPage() {
  return (
    <ResponsiveContainer>
      <NotificationsContainer />
    </ResponsiveContainer>
  );
}
