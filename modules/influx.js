const path = require("path");
const fs = require("fs");
const { InfluxDB } = require("@influxdata/influxdb-client");
const config = fs.existsSync(path.join(__dirname, "../config.json")) ? require("../config.json") : false;

module.exports = {
  lastHour: {},
  lastWeek: {},
  queryApi: false,
  connect: () => {
    const { url, token, org } = config;
    if (!url) {
      console.log("NO URL PROVIDED FOR INFLUXDB!");
      return;
    }
    console.log("Connecting.");
    module.exports.queryApi = new InfluxDB({ url, token }).getQueryApi(org);
  },
  run: async (querry) => {
    if (!module.exports.queryApi) {
      console.log("Not connected to the database!");
      return false;
    }

    try {
      console.log("Executing  querry.");
      const data = await module.exports.queryApi.collectRows(querry);
      console.log("Received data!");
      return data;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
  fetch: async (io, days) => {
    if (!config) {
      console.log("PLEASE ADD THE CORRECT CONFIG.JSON!!!");
      return;
    }
    console.log("Attempting to fetch data from InfluxDB.");

    let today = new Date(Date.now());
    today.setHours(1, 0, 0, 0);
    const stopdate = today.toISOString();
    today = today.minusDays(days);
    const startdate = today.toISOString();
    const querry = `from(bucket: "${config.bucket}") |> range(start: ${startdate}, stop: ${stopdate}) |> aggregateWindow(every: 1h, fn: last, createEmpty: false) `;
    const data = await module.exports.run(querry);

    if (!data) {
      console.log("Something went wrong while fetching data!\nGot empty data object, possibly because the database is offline.");
      return;
    }
    let number = 0;
    const raw = {};
    for (const thing of data) {
      if (!raw[thing._field]) {
        raw[thing._field] = [thing._value];
      } else {
        raw[thing._field].push(thing._value);
      }
    }
    const ret = {};

    //hours (server time) we see as morning / evening
    //morning <= time < evening = day
    //!day = night
    const morning = 6;
    const evening = 22;

    //totaal dag+nacht ( 24 waardes - subject to change make dynamic )
    for (const thing of data) {
      if (!ret[thing._field]) {
        number = 0;
        ret[thing._field] = thing._value;
        number += thing._value;
      } else {
        number += thing._value;
        ret[thing._field] = number;
      }
    }

    //totaal dag ( 16 waardes - subject to change make dynamic )
    const listdag = {};
    const listnacht = {};
    for (const thing of data) {
      const time = parseInt(thing._time.split("T")[1].split(":")[0]);
      if (!listdag[thing._field]) {
        number = 0;
        if (time < evening && time >= morning) {
          listdag[thing._field] = thing._value;
          number += thing._value;
        }
      } else {
        if (time < evening && time >= morning) {
          number += thing._value;
          listdag[thing._field] = number;
        }
      }
    }

    //totaal nacht ( 8 waardes - subject to change make dynamic )
    for (const thing of data) {
      const time = parseInt(thing._time.split("T")[1].split(":")[0]);
      if (!listnacht[thing._field]) {
        number = 0;
        if (time >= evening || time < morning) {
          listnacht[thing._field] = thing._value;
          number += thing._value;
        }
      } else {
        if (time >= evening || time < morning) {
          number += thing._value;
          listnacht[thing._field] = number;
        }
      }
    }
    //rawdata
    module.exports.raw = raw;
    io.emit("influxraw", module.exports.raw);
    //dag
    if (days == 1) {
      module.exports.lastdaytotal = ret;
      module.exports.lastday_day = listdag;
      module.exports.lastday_night = listnacht;
      io.emit("influxtotalDay", module.exports.lastdaytotal);
      io.emit("influxDay", module.exports.lastday_day, module.exports.lastday_night);
      console.log(`Pushed data to Socket.IO on topic "influx"!`);
    }

    //week
    if (days == 7) {
      module.exports.lastWeektotal = ret;
      module.exports.lastweek_day = listdag;
      module.exports.lastweek_night = listnacht;
      io.emit("influxtotalWeek", module.exports.lastWeektotal);
      io.emit("influxWeek", module.exports.lastweek_day, module.exports.lastweek_night);
      console.log(`Pushed data to Socket.IO on topic "influxWeek"!`);
    }
  },
  fetchPeriodically: async (io) => {
    console.log("First periodical fetch of the data.");
    await module.exports.fetch(io, 1);
    await module.exports.fetch(io, 7);
    setInterval(async () => {
      console.log("Periodical fetch of the data.");
      await module.exports.fetch(io, 1);
      await module.exports.fetch(io, 7);
    }, 5000);
  },
};
