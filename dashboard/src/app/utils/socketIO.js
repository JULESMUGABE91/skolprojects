import { io } from "socket.io-client";

const socket = io("wss://myskol.rw:9000", {
  transports: ["websocket"],
});

socket.connect();

export default socket;
