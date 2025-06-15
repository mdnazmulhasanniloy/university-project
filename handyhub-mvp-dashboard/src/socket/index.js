import { io } from "socket.io-client";
import { getSocketUrl } from "@/config";

const URL = getSocketUrl() || "http://115.127.156.14:2005";

export const socket = io(URL);
