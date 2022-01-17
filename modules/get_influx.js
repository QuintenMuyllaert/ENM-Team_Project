const path = require("path");
const fs = require("fs");
const { InfluxDB, HttpError } = require("@influxdata/influxdb-client");
const config = fs.existsSync(path.join(__dirname, "../config.json")) ? require("../config.json") : false;
const { url, token, org } = config;

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
};
