const socket = io();

socket.on("connect", () => {
  console.log("Connection to server made!");

  socket.emit("echo", "Hello world!");
  socket.emit("data", "get data");
  socket.on("echo", (data) => {
    console.log("echo", data);
  });

  socket.on("close", () => {
    console.log("Connection to server closed!");
  });
});
