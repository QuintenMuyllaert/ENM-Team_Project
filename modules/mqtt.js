const fs = require("fs");
const path = require("path");
const mqtt = require("mqtt");

const config = fs.existsSync(path.join(__dirname, "../config.json")) ? require("../config.json") : false;
const client = config.mqtt ? mqtt.connect(config.mqtt) : false;

let io = false;
let connected = false;

if (client) {
  client.on("connect", () => {
    connected = true;
    console.log("MQTT has connected!");
  });

  client.on("message", (topic, message) => {
    message = message.toString();
    let obj = {};
    const ret = {};
    try {
      obj = JSON.parse(message);
    } catch (e) {
      console.log("MQTT message not in JSON!");
      return;
    }

    // console.log("MQTT message received :", topic, obj);
    if (io) {
      io.emit("mqtt", topic, obj);
      // io.emit("echo", obj);
      for (let channel of obj.channelPowers) {
        // ret[serviceLocationId]
        if (!ret[channel.serviceLocationId]) {
          ret[channel.serviceLocationId] = [channel];
        } else {
          ret[channel.serviceLocationId].push(channel);
        }
      }

      io.emit("echo", ret);
    } else {
      console.log("PLEASE ATTACH SOCKETIO TO MQTT!");
    }
  });
} else {
  console.log("NO MQTT URL PROVIDED IN CONFIG!");
}

module.exports = {
  attachSocketIO: (socketio) => {
    io = socketio;
  },
  subscribe: (topic) => {
    if (!client) {
      console.log("NO MQTT CLIENT DEFINED IN CONFIG");
      return;
    }
    client.subscribe(topic);
  },
};
