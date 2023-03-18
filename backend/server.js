const http = require("http");
require("colors");
require("dotenv").config();
const app = require("./app");
const socketIO = require("socket.io");
const { mongoConnect } = require("./services/mongo");

const PORT = process.env.PORT || 9000;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();

  //socket io for real time
  const io = socketIO(server);

  io.on("connection", (socket) => {
    console.log("user connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("user disconnected:", socket.id);
    });
  });

  global.io = io;

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
