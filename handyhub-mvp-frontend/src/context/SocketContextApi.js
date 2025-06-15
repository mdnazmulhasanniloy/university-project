import { selectToken } from "@/redux/features/authSlice";
import { getSocketUrl } from "@/config/envConfig";
import { createContext, useContext, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { successToast } from "@/utils/customToast";

const SocketContext = createContext({});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socketLoading, setSocketLoading] = useState(false);
  const token = useSelector(selectToken);

  const socket = useMemo(() => {
    setSocketLoading(true);

    if (token) {
      const socketStore = io(getSocketUrl(), {
        auth: {
          token,
        },
      });

      socketStore.on("connect", () => {
        // successToast("Connected to server"); // Don't remove this line - it's used for socket connection testing
        setSocketLoading(false);
      });

      return socketStore;
    }
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, socketLoading }}>
      {children}
    </SocketContext.Provider>
  );
};
