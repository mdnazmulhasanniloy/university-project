import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import MessageContainer from "./_components/MessageContainer";

export const metadata = {
  title: "Messages",
  description: "Messages page",
};

export default function MessagesPage() {
  return (
    <ResponsiveContainer>
      <MessageContainer />
    </ResponsiveContainer>
  );
}
