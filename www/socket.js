const socket = io();

socket.on("connect", () => {
  console.log("Connection to server made!");
  socket.emit("influx");

  socket.on("close", () => {
    console.log("Connection to server closed!");
  });

  socket.on("mqtt", (topic, message) => {
    console.log("Got raw MQTT data!");
  });

  socket.on("mqttData", (data) => {
    console.log("Got processed MQTT data!");
    mqtt = data;
  });

  socket.on("influx", (data) => {
    console.log("Got raw influx data!");
  });

  socket.on("influxData", (data) => {
    console.log("Got processed influx data!");
    //influx variable is a global variable that stores the latest influx data point.
    influx = data;

    //Update all dataElements elements
    console.log(influx);
    dataElements.forEach(async (e) => {
      e.tick();
    });
  });

  socket.on("influxtotalDay", async (data) => {
    console.log("Got Influx data!");
  });

  socket.on("influxDay", async (dag, nacht) => {
    console.log(dag);
    console.log(nacht);
  });

  socket.on("slide", async (data) => {
    console.log("Received slide event!");
    if (data.event) {
      console.log("Got fetch event!");
      switch (data.event) {
        case "fetchFacts":
          didyouknow = await fetchTxt("./data/facts.csv");
          break;
        case "fetchQuestions":
          questions = await fetchJSON("./data/questions.json");
          break;
        case "showEndAnimation":
          await showEndAnimation();
          break;
        case "reinit":
          await init();
          break;
        case "refresh":
          document.location.href = document.location.href;
          break;
      }
    }
    if (data.slideLength >= 0) {
      slideLength = data.slideLength;
    }
    if (data.slideNr >= 0) {
      slideNr = data.slideNr;
    }
    if (data.endAnimationLength >= 0) {
      endAnimationLength = data.endAnimationLength * 1000;
    }
    await loop();
  });
});
