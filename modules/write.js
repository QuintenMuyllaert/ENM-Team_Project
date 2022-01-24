const token = "tU7mUt5ZDXUro0pL9P1Z72CZPJSBbqP9kxzUBQPvwI8QfjZECGsp4qCZNp2WMIX3MGHAxo51l8gBjyMDl2hVgA==";
const org = "enm";
const bucket = "Transfosite groep 2";
const { InfluxDB, Point, HttpError } = require("@influxdata/influxdb-client");
const { hostname } = require("os");
let writeApi;
module.exports = {
  connect: () => {
    writeApi = new InfluxDB({ url: "http://172.23.176.6:8086", token }).getWriteApi(org, bucket, "ns");
  },
  write: (data) => {
    // writeApi.useDefaultTags({ location: hostname() });
    // const point1 = new Point("temperature").tag("example", "write.ts").floatField("value", 20 + Math.round(100 * Math.random()) / 10);
    // writeApi.writePoint(point1);
    // console.log(` ${point1}`);
    // writeApi
    //   .close()
    //   .then(() => {
    //     console.log("FINISHED ... now try ./query.ts");
    //   })
    //   .catch((e) => {
    //     console.error(e);
    //     if (e instanceof HttpError && e.statusCode === 401) {
    //       console.log("d");
    //     }
    //     console.log("\nFinished ERROR");
    //   });
  },
};
