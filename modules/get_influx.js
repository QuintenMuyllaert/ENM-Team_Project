const path = require("path");
const fs = require("fs");
const { InfluxDB, HttpError } = require("@influxdata/influxdb-client");
const config = fs.existsSync(path.join(__dirname, "../config.json")) ? require("../config.json") : false;
const { bucket, url, token, org } = config;

module.exports = {
  run: async (querry) => {
    try {
      console.log("Reading");
      if (!url) {
        console.log("NO URL PROVIDED FOR INFLUXDB!");
        return;
      }
      const queryApi = new InfluxDB({ url, token }).getQueryApi(org);
      const fluxQuery = querry;
      console.log("*** QUERY ROWS ***");
      const api = await queryApi;
      const data = await api.collectRows(fluxQuery);
      // data.forEach((x) => console.log(JSON.stringify(x)));
      console.log("\nCollect ROWS SUCCESS");
      return data;
    } catch (err) {
      console.error(err);
      return;
    }
  },
  lastHour: {},
  lastWeek: {},
  fetch: async (io, days) => {
    if (!config) {
      console.log("PLEASE ADD THE CORRECT CONFIG.JSON!!!");
      return;
    }
    let today = new Date(Date.now());
    today.setHours(1, 0, 0, 0);
    const stopdate = today.toISOString();
    today = today.minusDays(days);
    const startdate = today.toISOString();
    const querry = `from(bucket: "${bucket}") |> range(start: ${startdate}, stop: ${stopdate}) |> aggregateWindow(every: 1h, fn: last, createEmpty: false) `;
    const data = await module.exports.run(querry);
    const ret = {};
    for (const thing of data) {
      if (!ret[thing._field]) {
        ret[thing._field] = [thing];
      } else {
        ret[thing._field].push(thing);
      }
    }
    if (days == 1) {
      module.exports.lastHour = ret;
      io.emit("Influx", module.exports.lastHour);
    }
    if (days == 7) {
      module.exports.lastWeek = ret;
      io.emit("Influx_week", module.exports.lastWeek);
    }
  },
  fetchPeriodically: async (io) => {
    await module.exports.fetch(io, 1);
    await module.exports.fetch(io, 7);
    setInterval(async () => {
      await module.exports.fetch(io, 1);
      await module.exports.fetch(io, 7);
    }, 10 * 60 * 1000);
  },
};
