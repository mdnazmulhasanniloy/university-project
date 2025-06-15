import React, { useEffect, useState } from "react";
import OwnerMsgCard from "./OwnerMsgCard";
import ReceiverMsgCard from "./ReceiverMsgCard";
import { format } from "date-fns";

export default function MessageCard({
  message,
  userId,
  previousMessage,
  selectedUser,
}) {
  const isDifferentSender =
    !previousMessage || previousMessage.sender !== message.sender;

  // format message sent time
  const [sentTime, setSentTime] = useState("");
  useEffect(() => {
    if (isDifferentSender) {
      setSentTime(
        message?.createdAt ? format(message?.createdAt, "h:mm a") : "",
      );
    }
  }, [isDifferentSender, message]);

  return (
    <div className="">
      {message?.sender === userId ? (
        <div className="flex flex-col items-end">
          <div>
            {isDifferentSender && (
              <p className="text-end text-xs text-gray-400">{sentTime}</p>
            )}

            <OwnerMsgCard message={message} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start">
          {isDifferentSender && (
            <p className="ml-16 text-xs text-gray-400">{sentTime}</p>
          )}
          <ReceiverMsgCard
            message={message}
            isDifferentSender={isDifferentSender}
            selectedUser={selectedUser}
          />
        </div>
      )}
    </div>
  );
}
