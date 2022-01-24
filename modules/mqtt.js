const fs = require("fs");
const path = require("path");
const mqtt = require("mqtt");
const writer = require("../modules/write.js");
const config = fs.existsSync(path.join(__dirname, "../config.json")) ? require("../config.json") : false;
const client = config.mqtt ? mqtt.connect(config.mqtt) : false;

let io = false;
let connected = false;

if (client) {
  client.on("connect", () => {
    connected = true;
    console.log("Connected to server!");
  });

  client.on("message", (topic, message) => {
    console.log("Message received!");
    message = message.toString();
    let obj = {};
    const ret = {};
    try {
      obj = JSON.parse(message);
    } catch (e) {
      console.log("Message not in JSON!");
      return;
    }

    if (!io) {
      console.log("PLEASE ATTACH SOCKETIO TO MQTT!");
      return;
    }

    console.log("Relaying message to Socket.IO!");
    io.emit("mqtt", topic, obj);
    if (!obj.channelPowers) {
      console.log(`Data does not include "channelPowers"!`);
      return;
    }

    if (!Array.isArray(obj.channelPowers)) {
      console.log(`"channelPowers" is not an array!`);
      return;
    }

    for (let channel of obj.channelPowers) {
      if (!ret[channel.serviceLocationId]) {
        ret[channel.serviceLocationId] = [channel];
      } else {
        ret[channel.serviceLocationId].push(channel);
      }
    }

    console.log("Sending sanitized data to Socket.IO!");
    io.emit("mqttData", ret);
    writer.write(ret);
  });
} else {
  console.log("NO MQTT URL PROVIDED IN CONFIG!");
}

module.exports = {
  attachSocketIO: (socketio) => {
    console.log("Attaching Socket.IO object.");
    io = socketio;
  },
  subscribe: (topic) => {
    if (!client) {
      console.log("NO MQTT CLIENT DEFINED IN CONFIG");
      return;
    }
    console.log("Subscribing to topic.");
    client.subscribe(topic);
  },
};
