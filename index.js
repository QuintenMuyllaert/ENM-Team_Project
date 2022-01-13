const path = require("path");
const fs = require("fs");
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");

const get_influx = require("./modules/get_influx.js");
const tree = require("./modules/tree.js");
const mqtt = require("./modules/mqtt.js");

const config = fs.existsSync(path.join(__dirname, "config.json")) ? require("./config.json") : false;

Date.prototype.minusDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() - days);
  return date;
};

const app = express();
const server = http.createServer(app);
const io = new Server(server);

mqtt.attachSocketIO(io);
mqtt.subscribe("servicelocation/477d2645-2919-44c3-acf7-cad592ce7cdc/realtime");

app.use(express.static(path.join(__dirname, "www")));

app.get("/tree.json", async (req, res) => {
  res.send(JSON.stringify(await tree(path.join(__dirname, "www")), null, 4));
});

io.on("connection", (socket) => {
  console.log(`A user connected to the server : "${socket.id}"`);
  socket.on("disconnect", () => {
    console.log(`User disconnected : ${socket.id}`);
  });

  socket.on("echo", (msg) => {
    socket.emit("echo", msg);
  });
  socket.on("data", async (msg) => {
    if (!config) {
      console.log("PLEASE ADD THE CORRECT CONFIG.JSON!!!");
      return;
    }
    let today = new Date(Date.now());
    const stopdate = today.toISOString();
    today = today.minusDays(msg);
    const startdate = today.toISOString();
    const data = await get_influx.run(startdate, stopdate);

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
