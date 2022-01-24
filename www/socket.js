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
    console.log("MQTT Data", data["70997"]);
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
    const pie = ["Bord_Waterbehandeling_Totaal", "Bord_HVAC_Totaal", "Stopcontacten_Circuit_Niveau0_Cafetaria_Totaal", "Bord_EB_Niveau1_Totaal", "Compressor_Totaal", "Buitenbar_Totaal"];
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
    pie[pie.indexOf("Stopcontacten_Circuit_Niveau0_Cafetaria_Totaal")] = "Gelegenheid ";
    pie[pie.indexOf("Bord_EB_Niveau1_Totaal")] = "Andere";
    elementChartPie.data = { ...elementChartPie.data, data: values, labels: pie };
    elementNumberDay.data = `Verbruik dag: ${day.toFixed(2)} kW`;
    elementNumberNight.data = `Verbruik nacht: ${night.toFixed(2)} kW`;
    const total = day + night;
    elementNumberOneDay.data = `${total.toFixed(2)}`;
    elementChartDayNight.data = [day, night];
    const houses = document.querySelector(".js-vergelijking");
    if (!houses) {
      return;
    }
    houses.innerHTML = `<svg class="svg--house" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 126.27 116.13">
      <defs>
        <style>
          .cls-1 {
            fill: #ed1c24;
          }

          .cls-2 {
            fill: #cf1c24;
          }
        </style>
      </defs>
      <g id="Building">
        <g id="Walls" class="svg--house-walls">
          <path class="cls-1" d="M100.51,55.11h-.62L55.18,98.8v34a12,12,0,0,0,12,12h21.5V113.14h22.68V144.8h21.51a12,12,0,0,0,12-12V98.45Z" transform="translate(-37.8 -30.26)"/>
          <path class="cls-2" d="M100.51,53.61a3.14,3.14,0,0,0-2.57,1.31L94.76,58,83.84,68.7,59,93a65.9,65.9,0,0,0-4.85,4.75c-.74.89-.44,2.57-.44,3.65v25.33c0,4.43-.47,9.05,1.93,13A13.71,13.71,0,0,0,66,146.24c1.66.16,3.37.06,5,.06H88.68a1.52,1.52,0,0,0,1.5-1.5V113.14l-1.5,1.5h22.68l-1.5-1.5V144.8a1.52,1.52,0,0,0,1.5,1.5h13.46c5,0,10.7.75,15.13-2A13.71,13.71,0,0,0,146.3,134a36.1,36.1,0,0,0,.07-3.75V99.43a2.75,2.75,0,0,0-.63-2.22c-.68-.72-1.41-1.39-2.12-2.08L120.81,72.85c-6.3-6.16-12.52-12.41-18.9-18.47l-.34-.33c-1.38-1.35-3.5.77-2.12,2.12l15.07,14.72,23.8,23.25,5.49,5.37-.44-1.06v28.26c0,4.14.56,8.63-2,12.2a10.69,10.69,0,0,1-8.71,4.39H111.36l1.5,1.5V113.14a1.52,1.52,0,0,0-1.5-1.5H88.68a1.52,1.52,0,0,0-1.5,1.5V144.8l1.5-1.5H68.18a11.73,11.73,0,0,1-7.11-2,10.65,10.65,0,0,1-4.39-8.65c0-1.34,0-2.69,0-4V98.8l-.44,1.06L71.4,85.05l24-23.49L101,56.17l-1.07.44h.62A1.5,1.5,0,0,0,100.51,53.61Z" transform="translate(-37.8 -30.26)"/>
        </g>
      </g>
      <g id="Roof" class="svg--house-roof">
        <path id="Roof-2" data-name="Roof" class="cls-2" d="M162.69,88.44l-32.79-32a4.08,4.08,0,0,0,.12-.93V36.57a4,4,0,0,0-4-4h-2.68a4,4,0,0,0-3.95,4v9.6L105.23,32.3a5.58,5.58,0,0,0-8.86.31h-.05L39.18,88.44A4.59,4.59,0,1,0,45.6,95l54.84-53.57.48,0a4.36,4.36,0,0,0,.51,0L156.27,95a4.59,4.59,0,0,0,6.42-6.57Z" transform="translate(-37.8 -30.26)"/>
      </g>
    </svg>
    <svg class="svg--house" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 126.27 116.13">
      <defs>
        <style>
          .cls-1 {
            fill: #ed1c24;
          }

          .cls-2 {
            fill: #cf1c24;
          }
        </style>
      </defs>
      <g id="Building">
        <g id="Walls" class="svg--house-walls">
          <path class="cls-1" d="M100.51,55.11h-.62L55.18,98.8v34a12,12,0,0,0,12,12h21.5V113.14h22.68V144.8h21.51a12,12,0,0,0,12-12V98.45Z" transform="translate(-37.8 -30.26)"/>
          <path class="cls-2" d="M100.51,53.61a3.14,3.14,0,0,0-2.57,1.31L94.76,58,83.84,68.7,59,93a65.9,65.9,0,0,0-4.85,4.75c-.74.89-.44,2.57-.44,3.65v25.33c0,4.43-.47,9.05,1.93,13A13.71,13.71,0,0,0,66,146.24c1.66.16,3.37.06,5,.06H88.68a1.52,1.52,0,0,0,1.5-1.5V113.14l-1.5,1.5h22.68l-1.5-1.5V144.8a1.52,1.52,0,0,0,1.5,1.5h13.46c5,0,10.7.75,15.13-2A13.71,13.71,0,0,0,146.3,134a36.1,36.1,0,0,0,.07-3.75V99.43a2.75,2.75,0,0,0-.63-2.22c-.68-.72-1.41-1.39-2.12-2.08L120.81,72.85c-6.3-6.16-12.52-12.41-18.9-18.47l-.34-.33c-1.38-1.35-3.5.77-2.12,2.12l15.07,14.72,23.8,23.25,5.49,5.37-.44-1.06v28.26c0,4.14.56,8.63-2,12.2a10.69,10.69,0,0,1-8.71,4.39H111.36l1.5,1.5V113.14a1.52,1.52,0,0,0-1.5-1.5H88.68a1.52,1.52,0,0,0-1.5,1.5V144.8l1.5-1.5H68.18a11.73,11.73,0,0,1-7.11-2,10.65,10.65,0,0,1-4.39-8.65c0-1.34,0-2.69,0-4V98.8l-.44,1.06L71.4,85.05l24-23.49L101,56.17l-1.07.44h.62A1.5,1.5,0,0,0,100.51,53.61Z" transform="translate(-37.8 -30.26)"/>
        </g>
      </g>
      <g id="Roof" class="svg--house-roof">
        <path id="Roof-2" data-name="Roof" class="cls-2" d="M162.69,88.44l-32.79-32a4.08,4.08,0,0,0,.12-.93V36.57a4,4,0,0,0-4-4h-2.68a4,4,0,0,0-3.95,4v9.6L105.23,32.3a5.58,5.58,0,0,0-8.86.31h-.05L39.18,88.44A4.59,4.59,0,1,0,45.6,95l54.84-53.57.48,0a4.36,4.36,0,0,0,.51,0L156.27,95a4.59,4.59,0,0,0,6.42-6.57Z" transform="translate(-37.8 -30.26)"/>
      </g>
    </svg>
    <svg class="svg--house" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 126.27 116.13">
      <defs>
        <style>
          .cls-1 {
            fill: #ed1c24;
          }

          .cls-2 {
            fill: #cf1c24;
          }
        </style>
      </defs>
      <g id="Building">
        <g id="Walls" class="svg--house-walls">
          <path class="cls-1" d="M100.51,55.11h-.62L55.18,98.8v34a12,12,0,0,0,12,12h21.5V113.14h22.68V144.8h21.51a12,12,0,0,0,12-12V98.45Z" transform="translate(-37.8 -30.26)"/>
          <path class="cls-2" d="M100.51,53.61a3.14,3.14,0,0,0-2.57,1.31L94.76,58,83.84,68.7,59,93a65.9,65.9,0,0,0-4.85,4.75c-.74.89-.44,2.57-.44,3.65v25.33c0,4.43-.47,9.05,1.93,13A13.71,13.71,0,0,0,66,146.24c1.66.16,3.37.06,5,.06H88.68a1.52,1.52,0,0,0,1.5-1.5V113.14l-1.5,1.5h22.68l-1.5-1.5V144.8a1.52,1.52,0,0,0,1.5,1.5h13.46c5,0,10.7.75,15.13-2A13.71,13.71,0,0,0,146.3,134a36.1,36.1,0,0,0,.07-3.75V99.43a2.75,2.75,0,0,0-.63-2.22c-.68-.72-1.41-1.39-2.12-2.08L120.81,72.85c-6.3-6.16-12.52-12.41-18.9-18.47l-.34-.33c-1.38-1.35-3.5.77-2.12,2.12l15.07,14.72,23.8,23.25,5.49,5.37-.44-1.06v28.26c0,4.14.56,8.63-2,12.2a10.69,10.69,0,0,1-8.71,4.39H111.36l1.5,1.5V113.14a1.52,1.52,0,0,0-1.5-1.5H88.68a1.52,1.52,0,0,0-1.5,1.5V144.8l1.5-1.5H68.18a11.73,11.73,0,0,1-7.11-2,10.65,10.65,0,0,1-4.39-8.65c0-1.34,0-2.69,0-4V98.8l-.44,1.06L71.4,85.05l24-23.49L101,56.17l-1.07.44h.62A1.5,1.5,0,0,0,100.51,53.61Z" transform="translate(-37.8 -30.26)"/>
        </g>
      </g>
      <g id="Roof" class="svg--house-roof">
        <path id="Roof-2" data-name="Roof" class="cls-2" d="M162.69,88.44l-32.79-32a4.08,4.08,0,0,0,.12-.93V36.57a4,4,0,0,0-4-4h-2.68a4,4,0,0,0-3.95,4v9.6L105.23,32.3a5.58,5.58,0,0,0-8.86.31h-.05L39.18,88.44A4.59,4.59,0,1,0,45.6,95l54.84-53.57.48,0a4.36,4.36,0,0,0,.51,0L156.27,95a4.59,4.59,0,0,0,6.42-6.57Z" transform="translate(-37.8 -30.26)"/>
      </g>
    </svg>
    <svg class="svg--house" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 126.27 116.13">
      <defs>
        <style>
          .cls-1 {
            fill: #ed1c24;
          }

          .cls-2 {
            fill: #cf1c24;
          }
        </style>
      </defs>
      <g id="Building">
        <g id="Walls" class="svg--house-walls">
          <path class="cls-1" d="M100.51,55.11h-.62L55.18,98.8v34a12,12,0,0,0,12,12h21.5V113.14h22.68V144.8h21.51a12,12,0,0,0,12-12V98.45Z" transform="translate(-37.8 -30.26)"/>
          <path class="cls-2" d="M100.51,53.61a3.14,3.14,0,0,0-2.57,1.31L94.76,58,83.84,68.7,59,93a65.9,65.9,0,0,0-4.85,4.75c-.74.89-.44,2.57-.44,3.65v25.33c0,4.43-.47,9.05,1.93,13A13.71,13.71,0,0,0,66,146.24c1.66.16,3.37.06,5,.06H88.68a1.52,1.52,0,0,0,1.5-1.5V113.14l-1.5,1.5h22.68l-1.5-1.5V144.8a1.52,1.52,0,0,0,1.5,1.5h13.46c5,0,10.7.75,15.13-2A13.71,13.71,0,0,0,146.3,134a36.1,36.1,0,0,0,.07-3.75V99.43a2.75,2.75,0,0,0-.63-2.22c-.68-.72-1.41-1.39-2.12-2.08L120.81,72.85c-6.3-6.16-12.52-12.41-18.9-18.47l-.34-.33c-1.38-1.35-3.5.77-2.12,2.12l15.07,14.72,23.8,23.25,5.49,5.37-.44-1.06v28.26c0,4.14.56,8.63-2,12.2a10.69,10.69,0,0,1-8.71,4.39H111.36l1.5,1.5V113.14a1.52,1.52,0,0,0-1.5-1.5H88.68a1.52,1.52,0,0,0-1.5,1.5V144.8l1.5-1.5H68.18a11.73,11.73,0,0,1-7.11-2,10.65,10.65,0,0,1-4.39-8.65c0-1.34,0-2.69,0-4V98.8l-.44,1.06L71.4,85.05l24-23.49L101,56.17l-1.07.44h.62A1.5,1.5,0,0,0,100.51,53.61Z" transform="translate(-37.8 -30.26)"/>
        </g>
      </g>
      <g id="Roof" class="svg--house-roof">
        <path id="Roof-2" data-name="Roof" class="cls-2" d="M162.69,88.44l-32.79-32a4.08,4.08,0,0,0,.12-.93V36.57a4,4,0,0,0-4-4h-2.68a4,4,0,0,0-3.95,4v9.6L105.23,32.3a5.58,5.58,0,0,0-8.86.31h-.05L39.18,88.44A4.59,4.59,0,1,0,45.6,95l54.84-53.57.48,0a4.36,4.36,0,0,0,.51,0L156.27,95a4.59,4.59,0,0,0,6.42-6.57Z" transform="translate(-37.8 -30.26)"/>
      </g>
    </svg>
    <svg class="svg--house" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 126.27 116.13">
      <defs>
        <style>
          .cls-1 {
            fill: #ed1c24;
          }

          .cls-2 {
            fill: #cf1c24;
          }
        </style>
      </defs>
      <g id="Building">
        <g id="Walls" class="svg--house-walls">
          <path class="cls-1" d="M100.51,55.11h-.62L55.18,98.8v34a12,12,0,0,0,12,12h21.5V113.14h22.68V144.8h21.51a12,12,0,0,0,12-12V98.45Z" transform="translate(-37.8 -30.26)"/>
          <path class="cls-2" d="M100.51,53.61a3.14,3.14,0,0,0-2.57,1.31L94.76,58,83.84,68.7,59,93a65.9,65.9,0,0,0-4.85,4.75c-.74.89-.44,2.57-.44,3.65v25.33c0,4.43-.47,9.05,1.93,13A13.71,13.71,0,0,0,66,146.24c1.66.16,3.37.06,5,.06H88.68a1.52,1.52,0,0,0,1.5-1.5V113.14l-1.5,1.5h22.68l-1.5-1.5V144.8a1.52,1.52,0,0,0,1.5,1.5h13.46c5,0,10.7.75,15.13-2A13.71,13.71,0,0,0,146.3,134a36.1,36.1,0,0,0,.07-3.75V99.43a2.75,2.75,0,0,0-.63-2.22c-.68-.72-1.41-1.39-2.12-2.08L120.81,72.85c-6.3-6.16-12.52-12.41-18.9-18.47l-.34-.33c-1.38-1.35-3.5.77-2.12,2.12l15.07,14.72,23.8,23.25,5.49,5.37-.44-1.06v28.26c0,4.14.56,8.63-2,12.2a10.69,10.69,0,0,1-8.71,4.39H111.36l1.5,1.5V113.14a1.52,1.52,0,0,0-1.5-1.5H88.68a1.52,1.52,0,0,0-1.5,1.5V144.8l1.5-1.5H68.18a11.73,11.73,0,0,1-7.11-2,10.65,10.65,0,0,1-4.39-8.65c0-1.34,0-2.69,0-4V98.8l-.44,1.06L71.4,85.05l24-23.49L101,56.17l-1.07.44h.62A1.5,1.5,0,0,0,100.51,53.61Z" transform="translate(-37.8 -30.26)"/>
        </g>
      </g>
      <g id="Roof" class="svg--house-roof">
        <path id="Roof-2" data-name="Roof" class="cls-2" d="M162.69,88.44l-32.79-32a4.08,4.08,0,0,0,.12-.93V36.57a4,4,0,0,0-4-4h-2.68a4,4,0,0,0-3.95,4v9.6L105.23,32.3a5.58,5.58,0,0,0-8.86.31h-.05L39.18,88.44A4.59,4.59,0,1,0,45.6,95l54.84-53.57.48,0a4.36,4.36,0,0,0,.51,0L156.27,95a4.59,4.59,0,0,0,6.42-6.57Z" transform="translate(-37.8 -30.26)"/>
      </g>
    </svg>
    `;
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
