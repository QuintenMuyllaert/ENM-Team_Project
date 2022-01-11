const path = require("path");
const fs = require("fs");
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");

const get_influx = require("./modules/get_influx.js");
const config = fs.existsSync(path.join(__dirname, "config.json")) ? require("./config.json") : false;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "www")));

io.on("connection", (socket) => {
  console.log(`A user connected to the server : "${socket.id}"`);
  socket.on("disconnect", () => {
    console.log(`User disconnected : ${socket.id}`);
  });

  socket.on("echo", (msg) => {
    socket.emit("echo", msg);
  });
  socket.on("data", async (msg) => {
    const data = await get_influx.run();

    socket.emit("echo", data);
  });

  socket.on("error", (err) => console.error);
});

server.listen(80, async () => {
  console.log("App launched");
  if (!config) {
    console.log("PLEASE ADD THE CORRECT CONFIG.JSON!!!");
    return;
  }
});
