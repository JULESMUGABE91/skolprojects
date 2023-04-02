import { io } from "socket.io-client";

const socket = io("http://146.190.152.81:9000", {
  transports: ["websocket"],
});

socket.connect();

export default socket;
