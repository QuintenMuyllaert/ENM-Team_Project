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
    const ret = {};
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
    if (days == 1) {
      module.exports.lastHour = ret;
      io.emit("influx", module.exports.lastHour);
      console.log(`Pushed data to Socket.IO on topic "influx"!`);
    }
    if (days == 7) {
      module.exports.lastWeek = ret;
      io.emit("influxWeek", module.exports.lastWeek);
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
