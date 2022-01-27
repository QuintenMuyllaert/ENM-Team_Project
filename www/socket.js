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
    if (!data.TotaalNet) {
      return;
    }

    if (!data.TotaalNet.length) {
      return;
    }

    influx = data;
    dataElements.forEach(async (e) => {
      e.tick();
    });
    /*
    let night = 0;
    let day = 0;
    let pie = ["Bord_Waterbehandeling_Totaal", "Bord_HVAC_Totaal", "Stopcontacten_Circuit_Niveau0_Cafetaria_Totaal", "Bord_EB_Niveau1_Totaal", "Compressor_Totaal", "Buitenbar_Totaal"];
    let waardes_pie = [];
    let values = [];

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
    values.push(waardes_pie[pie.indexOf("Bord_Waterbehandeling_Totaal")] + waardes_pie[pie.indexOf("Compressor_Totaal")]);
    values.push(waardes_pie[pie.indexOf("Bord_HVAC_Totaal")]);
    values.push(waardes_pie[pie.indexOf("Buitenbar_Totaal")] + waardes_pie[pie.indexOf("Stopcontacten_Circuit_Niveau0_Cafetaria_Totaal")]);
    values.push(waardes_pie[pie.indexOf("Bord_EB_Niveau1_Totaal")]);
    pie[pie.indexOf("Bord_Waterbehandeling_Totaal")] = "Waterbehandeling";
    pie[pie.indexOf("Bord_HVAC_Totaal")] = "Airco";
    pie[pie.indexOf("Stopcontacten_Circuit_Niveau0_Cafetaria_Totaal")] = "horeca";
    pie[pie.indexOf("Bord_EB_Niveau1_Totaal")] = "Andere";
    elementChartPie.data = { ...elementChartPie.data, data: values, labels: pie };
    elementNumberDay.data = `${day.toFixed(2)}`;
    elementNumberNight.data = `${night.toFixed(2)}`;
    let total = day + night;
    elementNumberOneDay.data = `${total.toFixed(2)}`;
    elementChartDayNight.data = [day, night];
    const houses = document.querySelector(".js-vergelijking");
    if (houses) {
      houses.innerHTML = await fetchString("./svg/house.svg");
    }
    let dat = waardes_pie[pie.indexOf("Waterbehandeling")];
    let things = {
      "desktop computers": 1.4,
      "elektrische ovens": 3,
      wasmachines: 2.7,
      drogers: 2.87,
      "airco's": 8,
      "elektrische verwarmingen": 21.8,
      grasmaaiers: 0.9,
      lifen: 20,
      "keer dit scherm": 2.5,
    };
    let rngThing = Object.keys(things)[Math.round(Math.random() * (Object.keys(things).length - 1))];
    let num = Math.round(dat / things[rngThing]);

    // elementNumberDiveTitle.data = `Waterbehandeling in de duiktank verbruikt momenteel <span>${dat.toFixed(2)} kW/dag</span>!`;
    // elementNumberDiveText.data = `Dat is evenveel als <span>${num}</span> ${rngThing}!`;
    // day = 0;
    // night = 0;
    // for (waarde of data.Totaal_EB2) {
    //   const time = parseInt(waarde._time.split("T")[1].split(":")[0]);
    //   if (time >= 22 || time < 6) {
    //     night += waarde._value;
    //   } else {
    //     day += waarde._value;
    //   }
    // }
    // day = day / 1000;
    // night = night / 1000;
    // total = day + night;
    // elementNumberDayblok2.data = `${day.toFixed(2)}`;
    // elementNumberNightblok2.data = `${night.toFixed(2)}`;
    // elementNumberOneDayblok2.data = `${total.toFixed(2)}`;
    // pie = ["Aansluiting_Conciergewoning_EB2", "Aansluiting_Mechaniekersgebouw_EB2", "Stopcontact32A_EB2_C", "Aansluiting_Directeurswoning_EB2", "Aansluiting_Elektriciens_EB2", "Aansluiting_Opzichterswoning_En_Kantoorgebouwen_EB2", "Stopcontact63A_EB2_A", "Stopcontact63A_EB2_B"];
    // waardes_pie = [];
    // values = [];
    // for (key of pie) {
    //   let catogorie_value = 0;
    //   for (waarde of data[key]) {
    //     catogorie_value += waarde._value;
    //   }
    //   catogorie_value = catogorie_value / 1000;
    //   waardes_pie.push(catogorie_value);
    // }
    // values.push(waardes_pie[pie.indexOf("Aansluiting_Conciergewoning_EB2")]);
    // values.push(waardes_pie[pie.indexOf("Aansluiting_Mechaniekersgebouw_EB2")]);
    // values.push(waardes_pie[pie.indexOf("Stopcontact32A_EB2_C")] + waardes_pie[pie.indexOf("Stopcontact63A_EB2_A")] + waardes_pie[pie.indexOf("Stopcontact63A_EB2_B")]);
    // values.push(waardes_pie[pie.indexOf("Aansluiting_Directeurswoning_EB2")]);
    // values.push(waardes_pie[pie.indexOf("Aansluiting_Elektriciens_EB2")]);

    // values.push(waardes_pie[pie.indexOf("Aansluiting_Opzichterswoning_En_Kantoorgebouwen_EB2")]);

    // pie[pie.indexOf("Aansluiting_Conciergewoning_EB2")] = "Conciergewoning";
    // pie[pie.indexOf("Aansluiting_Directeurswoning_EB2")] = "Directeurswoning";
    // pie[pie.indexOf("Aansluiting_Elektriciens_EB2")] = "Elektriciens ";
    // pie[pie.indexOf("Aansluiting_Mechaniekersgebouw_EB2")] = "Mechaniekersgebouw";
    // pie[pie.indexOf("Aansluiting_Opzichterswoning_En_Kantoorgebouwen_EB2")] = "Opzichterswoning_En_Kantoorgebouwen";
    // pie[pie.indexOf("Stopcontact32A_EB2_C")] = "Stopcontacten";
    // elementChartPieBlok2.data = { ...elementChartPieBlok2.data, data: values, labels: pie };
  });

  socket.on("influxWeek", (data) => {
    console.log("Got Influx Week data!");
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
    night_week = 0;
    day_week = 0;
    for (waarde of data.Totaal_EB2) {
      const time = parseInt(waarde._time.split("T")[1].split(":")[0]);
      if (time >= 22 || time < 6) {
        night_week += waarde._value;
      } else {
        day_week += waarde._value;
      }
    }
    elementNumberDayWeekblok2.data = (day_week / 1000).toFixed(2);
    elementNumberNightWeekblok2.data = (night_week / 1000).toFixed(2);
    */
  });

  socket.on("slide", async (data) => {
    console.log("Received slide event!");
    config = { ...config, ...data };
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
    await loop();
  });
});
