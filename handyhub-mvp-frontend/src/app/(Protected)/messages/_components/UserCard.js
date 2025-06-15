import Image from "next/image";
import textTruncate from "@/utils/textTruncate";
import calculateTimeAgo from "@/utils/calculateTimeAgo";
import CustomAvatar from "@/components/CustomAvatar/CustomAvatar";

const UserCard = ({
  user,
  message,
  selectedUser,
  setSelectedUser,
  activeUsers,
  loggedInUserId,
}) => {
  const userData = { ...user?.participants[0], chatId: user?._id };

  const isActive = activeUsers?.includes(userData?._id);

  return (
    <div
      role="button"
      onClick={() => setSelectedUser(userData)}
      className={`flex cursor-pointer items-center gap-x-3 rounded-lg px-2 py-3 transition-all duration-300 ease-in-out hover:bg-primary-blue/50 ${
        selectedUser?._id === userData?._id &&
        "bg-primary-blue/10 hover:bg-primary-blue/10"
      }`}
    >
      <div className="relative">
        <CustomAvatar
          img={userData?.profile}
          name={userData?.name}
          className="size-12 border"
        />

        {isActive && (
          <div className="absolute bottom-0.5 right-1 size-2.5 rounded-full bg-green-500" />
        )}
      </div>

      <div className="flex-grow">
        <div className="mb-0.5 flex items-center justify-between">
          <h4 className="text-lg font-medium capitalize text-black">
            {userData?.name}
          </h4>
          {selectedUser?._id !== userData?._id && (
            <p className="text-secondary-2 text-xs text-gray-500">
              {calculateTimeAgo(message?.createdAt)}
            </p>
          )}
        </div>

        {!message?.seen &&
          userData?._id !== selectedUser?._id &&
          message?.sender !== loggedInUserId && (
            <p className="text-xs font-semibold">
              {textTruncate(message?.text, 40)}
            </p>
          )}
      </div>
    </div>
  );
};

export default UserCard;
