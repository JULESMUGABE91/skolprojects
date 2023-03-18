import { io } from "socket.io-client";

const socket = io("https://cleankigaliapi.huzalabs.com", {
  transports: ["websocket"],
});

socket.connect();

export default socket;
