const path = require("path");
const fs = require("fs");
const http = require("http");
const bcrypt = require("bcrypt");
const express = require("express");
const { Server } = require("socket.io");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const siofu = require("socketio-file-upload");

const console = require("./modules/console.js");
const influx = require("./modules/influx.js");
const tree = require("./modules/tree.js");
const mqtt = require("./modules/mqtt.js");
const tamper = require("./modules/tamper.js");
const slider = require("./modules/slider.js");
const writer = require("./modules/write.js");
const deleter = require("./modules/deleteinflux.js");

const config = fs.existsSync(path.join(__dirname, "config.json")) ? require("./config.json") : false;
console.log("Starting ENM-G2 Team_Project!\nMade possible by :\n - Quinten Muyllaert\n - Toby Bostoen\n - Jorrit Verfaillie\n - Florian Milleville\n");

const configer = require("./modules/configer.js");
configer.generateFrontend();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
slider.init(io);

Date.prototype.minusDays = function (days) {
  const today = Number(this);
  const minus = Number(1000 * 60 * 60 * 24 * days);
  const result = new Date(today - minus);
  return result;

  //old
  const date = new Date(this.valueOf());
  date.setHours(1, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date;
};

mqtt.attachSocketIO(io);
if (config.topic) {
  mqtt.subscribe(config.topic);
}

influx.connect();
writer.connect();
// deleter.delete();
influx.fetchPeriodically(io);

app.use(express.static(path.join(__dirname, "www")));
app.use(siofu.router);

app.get("/tree.json", async (req, res) => {
  console.log("Client requested ./www filetree.");
  res.send(JSON.stringify(await tree(path.join(__dirname, "www")), null, 4));
});

app.get("/slideorder.json", async (req, res) => {
  console.log("Client requested ./www slideorder.json");
  const slideorderPath = path.join(__dirname, "www", "data", "slideorder.json");
  const slideOrder = JSON.parse(fs.readFileSync(slideorderPath));
  const allSlides = Object.keys(await tree(path.join(__dirname, "www", "slide")));

  let order = [];
  let duped = slideOrder.concat(allSlides);
  for (const slide of duped) {
    if (!order.includes(slide) && allSlides.includes(slide)) {
      order.push(slide);
    }
  }

  fs.writeFileSync(slideorderPath, JSON.stringify(order, null, 4));

  res.send(JSON.stringify(order, null, 4));
});

io.on("connection", async (socket) => {
  socket.auth = false;

  console.log(`A user connected to the server : "${socket.id}".`);
  socket.on("disconnect", () => {
    console.log(`User disconnected : "${socket.id}".`);
  });

  socket.on("updatefacts", async (facts) => {
    if (!socket.auth) {
      return;
    }

    if (!tamper.structure(facts, ["fact"])) {
      return;
    }

    fs.writeFileSync(path.join(__dirname, "www", "data", "facts.csv"), facts.join("\n"));
    //refresh frontend
    io.emit("slide", { event: "refresh" });
  });

  socket.on("questions", async (question) => {
    if (!socket.auth) {
      return;
    }

    const questionStructure = [{ question: "q", answers: ["a1", "a2", "a3"], correct: "a1" }];

    if (!tamper.structure(questionStructure, question)) {
      console.log("Questions is in wrong structure.");
      return;
    }

    const data = JSON.stringify(question, null, 4);
    fs.writeFileSync(path.join(__dirname, "www", "data", "questions.json"), data);
    //refresh frontend
    io.emit("slide", { event: "refresh" });
  });

  socket.on("forget", async (code) => {
    console.log("Client sent a forgot password request.");
    const verfied = speakeasy.totp.verify({
      secret: `${config.twofactor}`,
      encoding: "ascii",
      token: `${code}`,
    });
    console.log(verfied);
  });

  socket.on("auth", async (obj) => {
    console.log("Client attempts to authenticate.");
    if (!obj) {
      console.log("Authentication failed, no object.");
      socket.emit("auth", false);
      return;
    }

    if (!(obj.username && obj.password)) {
      console.log("Authentication failed, wrong credentials.");
      socket.emit("auth", false);
      return;
    }

    if (!config.username || !config.password) {
      console.log("No username and/or password provided in config, registering user!");
      config.username = await bcrypt.hash(obj.username, await bcrypt.genSalt(10));
      config.password = await bcrypt.hash(obj.password, await bcrypt.genSalt(10));
      fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
    }

    if (!config.twofactor) {
      console.log("No twofactor secret in config, generating twofactor secret!");
      const secret = speakeasy.generateSecret({
        name: "Transfo_Recovery",
      });
      config.twofactor = secret.ascii;
      qrcode.toDataURL(secret.otpauth_url, function (err, data) {
        socket.emit("qrcode", data);
      });
      fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
    }

    if (!tamper.structure({ username: "", password: "" }, obj)) {
      console.log("Login wrong structure.");
      return;
    }

    if ((await bcrypt.compare(obj.username, config.username)) && (await bcrypt.compare(obj.password, config.password))) {
      console.log("Authentication successfull!");
      socket.emit("auth", true);

      const uploader = new siofu();
      uploader.dir = path.join(__dirname, "www", "upload");
      uploader.listen(socket);

      socket.auth = true;
    } else {
      console.log("Authentication failed, wrong credentials.");
      socket.emit("auth", false);
      socket.auth = false;
    }
  });

  socket.on("slide", (data) => {
    console.log("Got slide command from external source.");
    if (!socket.auth) {
      console.log("Source is not authorized to execute slide command.");
      return;
    }

    if (!tamper.structure({}, data)) {
      console.log("Slide command is wrong structure.");
      return;
    }

    console.log("Sending slide command to frontend!");
    io.emit("slide", data);
  });

  socket.on("order", (data) => {
    console.log("Got order command from external source.");
    if (!socket.auth) {
      console.log("Source is not authorized to execute order command.");
      return;
    }

    if (!tamper.structure([""], data)) {
      console.log("Order command is wrong structure.");
      return;
    }

    const slideorderPath = path.join(__dirname, "www", "data", "slideorder.json");
    fs.writeFileSync(slideorderPath, JSON.stringify(data, null, 4));
    //refresh frontend
    io.emit("slide", { event: "refresh" });
  });

  socket.on("save", (file, data) => {
    console.log("Got save command from external source.");
    if (!socket.auth) {
      console.log("Source is not authorized to execute save command.");
      socket.emit("save", false);
      return;
    }

    if (!tamper.structure(file, "") || !tamper.structure(data, "")) {
      console.log("Save command is wrong structure.");
      socket.emit("save", false);
      return;
    }

    if (file.includes("/") || file.includes("\\") || file.includes("./") || file.includes("../") || file.includes("..\\") || file.includes(".\\")) {
      console.log("Manipulation attempt of file path!");
      console.log("Logging them out as punishment.");
      socket.emit("auth", false);
      socket.auth = false;
      return;
    }

    if (file.split(".").length > 2) {
      console.log("Manipulation attempt double extension!");
      //not severe we ingore this.
    }

    const fullpath = path.join(__dirname, "www", "slide", file);
    if (!fullpath.includes(path.join(__dirname, "www", "slide"))) {
      console.log("All previous tamper checks failed, luckily this one caught it report to devs :\n", JSON.stringify({ file: file, data: data }, null, 4));
    }

    fs.writeFileSync(fullpath, data);

    console.log("Sending save success to frontend!");
    socket.emit("save", true);
    //refresh frontend
    io.emit("slide", { event: "refresh" });
  });

  socket.on("remove", (file) => {
    console.log("Got save command from external source.");
    if (!socket.auth) {
      console.log("Source is not authorized to execute save command.");
      socket.emit("remove", false);
      return;
    }

    if (!tamper.structure(file, "")) {
      console.log("Remove command is wrong structure.");
      socket.emit("remove", false);
      return;
    }

    if (file.includes("/") || file.includes("\\") || file.includes("./") || file.includes("../") || file.includes("..\\") || file.includes(".\\")) {
      console.log("Manipulation attempt of file path!");
      console.log("Logging them out as punishment.");
      socket.emit("auth", false);
      socket.auth = false;
      return;
    }

    if (file.split(".").length > 2) {
      console.log("Manipulation attempt double extension!");
      //not severe we ingore this.
    }

    const fullpath = path.join(__dirname, "www", "slide", file);
    if (!fullpath.includes(path.join(__dirname, "www", "slide"))) {
      console.log("All previous tamper checks failed, luckily this one caught it report to devs :\n", JSON.stringify({ file: file, data: data }, null, 4));
    }

    console.log(`Bye bye, ${fullpath}! You will / won't be missed...?`);
    fs.unlinkSync(fullpath);

    console.log("Sending remove success to frontend!");
    socket.emit("remove", true);
    //refresh frontend
    io.emit("slide", { event: "refresh" });
  });

  socket.on("control", (data) => {
    if (!socket.auth) {
      console.log("Source is not authorized to change control.");
      return;
    }
    if (!tamper.structure(true, data)) {
      console.log("Source sent non-boolean as control source.");
      return;
    }
    slide.control = data;
    console.log(slide.control ? "Server has control of the slideshow." : "Client has control of the slideshow.");
  });

  socket.on("influx", () => {
    socket.emit("influxData", influx.data);
  });

  slider.onConnect(socket);

  console.log("Sending Influx data...");
  if (influx.data) {
    socket.emit("influxData", influx.data);
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
