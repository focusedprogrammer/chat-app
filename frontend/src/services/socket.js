import { io } from "socket.io-client";

const socket = io(
  "chat-app-production-2e1b.up.railway.app",
  {
    autoConnect: false
  }
);

export default socket;