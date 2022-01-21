const socket = io();

socket.on("connect", () => {
  console.log("Connection to server made!");

  socket.on("close", () => {
    console.log("Connection to server closed!");
  });

  socket.on("mqtt", (topic, message) => {
    console.log("raw MQTT Data", topic, message);
  });

  socket.on("mqttData", (data) => {
    console.log("MQTT Data", data);
  });

  socket.on("influx", (data) => {
    console.log("Influx Data", data);
    if (!data.TotaalNet) {
      return;
    }

    if (!data.TotaalNet.length) {
      return;
    }

    let night = 0;
    let day = 0;
    const pie = ["Bord_EB_Niveau1_Totaal", "Bord_HVAC_Totaal", "Bord_Waterbehandeling_Totaal", "Buitenbar_Totaal", "Compressor_Totaal", "Stopcontacten_Circuit_Niveau0_Cafetaria_Totaal"];
    let waardes_pie = [];

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
    for (key of pie) {
      let catogorie_value = 0;
      for (waarde of data[key]) {
        catogorie_value += waarde._value;
      }
      catogorie_value = catogorie_value / 1000;
      waardes_pie.push(catogorie_value);
    }
    pie[5] = "Cafetaria_Totaal";
    elementChartPie.data = { ...elementChartPie.data, data: waardes_pie, labels: pie };
    elementNumberDay.data = `Verbruik dag: ${day.toFixed(2)} kW`;
    elementNumberNight.data = `Verbruik nacht: ${night.toFixed(2)} kW`;
    const total = day + night;
    elementNumberOneDay.data = `${total.toFixed(2)}`;
    elementChartDayNight.data = [day, night];
  });

  socket.on("influxWeek", (data) => {
    if (!data.TotaalNet) {
      return;
    }

    if (!data.TotaalNet.length) {
      return;
    }

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
    elementNumberNightWeek.data = (night_week / 1000).toFixed(2);
    elementNumberDayWeek.data = (day_week / 1000).toFixed(2);
  });
});
