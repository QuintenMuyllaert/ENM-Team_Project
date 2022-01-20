const socket = io();

socket.on("connect", () => {
  console.log("Connection to server made!");

  socket.on("mqtt_data", (data) => {
    console.log("MQTT Data", data);
  });

  socket.on("close", () => {
    console.log("Connection to server closed!");
  });

  socket.on("Influx", (data) => {
    if (!data.TotaalNet) {
      return;
    }

    if (!data.TotaalNet.length) {
      return;
    }

    night = 0;
    day = 0;
    for (waarde of data.TotaalNet) {
      const time = parseInt(waarde._time.split("T")[1].split(":")[0]);
      if (time >= 22 || time < 6) {
        night += waarde._value;
      } else {
        day += waarde._value;
      }
    }
    night = night / 1000;
    day = day / 1000;
    for (key in pie) {
      let catogorie_value = 0;
      for (waarde of data[key]) {
        catogorie_value += waarde._value;
      }
      catogorie_value = catogorie_value / 1000;
      pie[key] = catogorie_value.toFixed(2);
    }
    console.log(pie);

    renderDayNight();
  });

  socket.on("Influx_week", (data) => {
    if (!data.TotaalNet) {
      return;
    }

    if (!data.TotaalNet.length) {
      return;
    }

    night_week = 0;
    day_week = 0;
    for (waarde of data.TotaalNet) {
      const time = parseInt(waarde._time.split("T")[1].split(":")[0]);
      if (time >= 22 || time < 6) {
        night_week += waarde._value;
      } else {
        day_week += waarde._value;
      }
    }
    night_week = night_week / 1000;
    day_week = day_week / 1000;
    renderDayNight();
  });
});
