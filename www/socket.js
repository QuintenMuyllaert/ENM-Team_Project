const socket = io();

socket.on("connect", () => {
  console.log("Connection to server made!");
  // socket.emit("data", 1);
  // socket.on("Influx", (data) => {
  //   console.log("Influx Data", data);
  // });
  socket.on("mqtt_data", (data) => {
    console.log("MQTT Data", data);
  });

  socket.on("close", () => {
    console.log("Connection to server closed!");
  });
});
