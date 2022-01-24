const token = "tU7mUt5ZDXUro0pL9P1Z72CZPJSBbqP9kxzUBQPvwI8QfjZECGsp4qCZNp2WMIX3MGHAxo51l8gBjyMDl2hVgA==";
const org = "enm";
const bucket = "Transfosite groep 2";
const { InfluxDB, Point, HttpError } = require("@influxdata/influxdb-client");
const { DeleteAPI } = require("@influxdata/influxdb-client-apis");
const { hostname } = require("os");
let writeApi;
let influxclient;
module.exports = {
  connect: () => {
    influxclient = new InfluxDB({ url: "http://172.23.176.6:8086", token });
  },
  write: async (data) => {
    writeApi = influxclient.getWriteApi(org, bucket, "ns");
    for (let key of data["70997"]) {
      writeApi.useDefaultTags({ location: "70997" });
      const point1 = new Point("power").tag("location", "70997").floatField("value", key.apparentPower);
      writeApi.writePoint(point1);
      console.log(` ${point1}`);
    }
    writeApi
      .close()
      .then(() => {
        console.log("FINISHED");
      })
      .catch((e) => {
        console.error(e);
        if (e instanceof HttpError && e.statusCode === 401) {
          console.log("d");
        }
        console.log("\nFinished ERROR");
      });
  },
};
