const path = require("path");
const fs = require("fs");
const http = require("http");
const bcrypt = require("bcrypt");
const express = require("express");
const { Server } = require("socket.io");

const get_influx = require("./modules/get_influx.js");
const tree = require("./modules/tree.js");
const mqtt = require("./modules/mqtt.js");

const config = fs.existsSync(path.join(__dirname, "config.json")) ? require("./config.json") : false;
const { bucket } = config;
Date.prototype.minusDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() - days);
  return date;
};

const app = express();
const server = http.createServer(app);
const io = new Server(server);

mqtt.attachSocketIO(io);
if (config.topic) {
  mqtt.subscribe(config.topic);
}

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
    const querry = `from(bucket: "${bucket}") |> range(start: ${startdate}, stop: ${stopdate}) |> aggregateWindow(every: 1h, fn: last, createEmpty: false) `;
    const data = await get_influx.run(querry);
    const ret = {};
    for (const thing of data) {
      if (!ret[thing._field]) {
        ret[thing._field] = [thing._value];
      } else {
        ret[thing._field].push(thing._value);
      }
    }
    socket.emit("echo", ret);
  });

  socket.auth = false;
  socket.on("auth", async (obj) => {
    if (!obj) {
      socket.emit("auth", false);
      return;
    }
    if (!(obj.username && obj.password)) {
      socket.emit("auth", false);
      return;
    }

    if (!config.username || !config.password) {
      console.log("No username and/or password provided in config.");

      config.username = await bcrypt.hash(obj.username, await bcrypt.genSalt(10));
      config.password = await bcrypt.hash(obj.password, await bcrypt.genSalt(10));

      fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
    }

    if ((await bcrypt.compare(obj.username, config.username)) && (await bcrypt.compare(obj.password, config.password))) {
      socket.emit("auth", true);
      socket.auth = true;
    } else {
      socket.emit("auth", false);
      socket.auth = false;
    }
  });
  socket.on("error", (err) => console.error);
});

server.listen(config.port || 80, async () => {
  console.log("App launched");
  if (!config) {
    console.log("PLEASE ADD THE CORRECT CONFIG.JSON!!!");
    return;
  }
});
