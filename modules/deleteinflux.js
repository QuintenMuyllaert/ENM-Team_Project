const fs = require("fs");
const path = require("path");
const config = fs.existsSync(path.join(__dirname, "../config.json")) ? require("../config.json") : false;
const { tokenwrite } = config;
const org = "enm";
const bucket = "Transfosite groep 2";
const { InfluxDB } = require("@influxdata/influxdb-client");

let influxclient;
module.exports = {
  delete: async () => {
    if (!tokenwrite) {
      return;
    }
    influxclient = new InfluxDB({ url: "http://172.23.176.6:8086", token: tokenwrite });
    const { DeleteAPI } = require("@influxdata/influxdb-client-apis");
    const deleteAPI = new DeleteAPI(influxclient);
    // define time interval for delete operation

    const stop = new Date();
    const start = new Date(stop.getTime() - /* an hour */ 600 * 600 * 1000);
    await deleteAPI.postDelete({
      org,
      bucket,
      // you can better specify orgID, bucketID in place or org, bucket if you already know them
      body: {
        start: start.toISOString(),
        stop: stop.toISOString(),
        // see https://docs.influxdata.com/influxdb/v2.1/reference/syntax/delete-predicate/
        predicate: '_measurement="power"',
      },
    });
  },
};
