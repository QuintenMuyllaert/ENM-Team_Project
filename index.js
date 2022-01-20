const path = require("path");
const fs = require("fs");
const http = require("http");
const bcrypt = require("bcrypt");
const express = require("express");
const { Server } = require("socket.io");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

const get_influx = require("./modules/get_influx.js");
const tree = require("./modules/tree.js");
const mqtt = require("./modules/mqtt.js");

const config = fs.existsSync(path.join(__dirname, "config.json")) ? require("./config.json") : false;
const { bucket } = config;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

Date.prototype.minusDays = function (days) {
  const date = new Date(this.valueOf());
  date.setHours(1, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date;
};

mqtt.attachSocketIO(io);
if (config.topic) {
  mqtt.subscribe(config.topic);
}

get_influx.fetchPeriodically(io);

app.use(express.static(path.join(__dirname, "www")));

app.get("/tree.json", async (req, res) => {
  res.send(JSON.stringify(await tree(path.join(__dirname, "www")), null, 4));
});

io.on("connection", async (socket) => {
  socket.auth = false;

  console.log(`A user connected to the server : "${socket.id}"`);
  socket.on("disconnect", () => {
    console.log(`User disconnected : ${socket.id}`);
  });

  socket.on("forget", async (code) => {
    const verfied = speakeasy.totp.verify({
      secret: `${config.twofactor}`,
      encoding: "ascii",
      token: `${code}`,
    });
    console.log(verfied);
  });

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

    if (!config.twofactor) {
      const secret = speakeasy.generateSecret({
        name: "Transfo_Recovery",
      });
      config.twofactor = secret.ascii;
      qrcode.toDataURL(secret.otpauth_url, function (err, data) {
        socket.emit("qrcode", data);
      });
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

  if (!Object.keys(get_influx.lastHour).length || !Object.keys(get_influx.lastHour).length) {
    console.log("Fetching Influx data...");
    await get_influx.fetch(socket, 1);
    await get_influx.fetch(socket, 7);
  } else {
    console.log("Sending cached Influx data...");
    socket.emit("Influx", get_influx.lastHour);
    socket.emit("Influx_week", get_influx.lastWeek);
  }

  socket.on("error", (err) => console.error);
});

server.listen(config.port || 80, async () => {
  console.log("App launched");
  if (!config) {
    console.log("PLEASE ADD THE CORRECT CONFIG.JSON!!!");
    return;
  }
});
