const socket = io();

socket.on("connect", () => {
  console.log("Connection to server made!");

  socket.on("close", () => {
    console.log("Connection to server closed!");
  });

  socket.on("mqtt", (topic, message) => {
    console.log("Got MQTT data!");
  });

  socket.on("mqttData", (data) => {
    console.log("Got processed MQTT data!");
    mqtt = data;
  });

  socket.on("influx", async (data) => {
    console.log("Got Influx data!");
    // if (!data.TotaalNet) {
    //   return;
    // }

    // if (!data.TotaalNet.length) {
    //   return;
    // }

    influx = data;
    dataElements.forEach(async (e) => {
      e.tick();
    });
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
