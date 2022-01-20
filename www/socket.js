const socket = io();

socket.on("connect", () => {
  console.log("Connection to server made!");

  socket.on("mqtt_data", (data) => {
    console.log("MQTT Data", data);
  });

  socket.on("close", () => {
    console.log("Connection to server closed!");
  });

  socket.emit("data", 1);

  socket.on("Influx", (data) => {
    console.log(data);

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
    document.querySelector(".js-day").innerText = `Verbruik dag: ${day.toFixed(2)} kW`;
    document.querySelector(".js-night").innerText = `Verbruik nacht: ${night.toFixed(2)} kW`;
    const total = day + night;
    document.querySelector(".js-oneday").innerText = `${total.toFixed(2)}`;

    console.log(day, night);
    renderChartDayNight([day, night]);
  });

  socket.emit("data", 7);
  socket.on("Influx_week", (data) => {
    let night_week = 0;
    let day_week = 0;
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
    document.querySelector(".js-dagweek").innerText = `${day_week.toFixed(2)}`;
    document.querySelector(".js-nightweek").innerText = `${night_week.toFixed(2)}`;
  });
});
