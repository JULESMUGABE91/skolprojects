import { io } from "socket.io-client";

const socket = io("https://myskol.rw/api", {
  transports: ["websocket"],
});

socket.connect();

export default socket;
