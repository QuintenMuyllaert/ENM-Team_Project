const fs = require("fs");
const path = require("path");
const config = fs.existsSync(path.join(__dirname, "../config.json")) ? require("../config.json") : false;
const { tokenwrite } = config;
const org = "enm";
const bucket = "Transfosite groep 2";
const { InfluxDB, Point, HttpError, flux, fluxDuration, DEFAULT_WriteOptions } = require("@influxdata/influxdb-client");
let writeApi;
let influxclient;
const flushBatchSize = DEFAULT_WriteOptions.batchSize;
const writeOptions = {
  /* the maximum points/line to send in a single batch to InfluxDB server */
  batchSize: flushBatchSize + 1, // don't let automatically flush data
  /* default tags to add to every point */
  defaultTags: { location: "70997" },
  /* maximum time in millis to keep points in an unflushed batch, 0 means don't periodically flush */
  flushInterval: 0,
  /* maximum size of the retry buffer - it contains items that could not be sent for the first time */
  maxBufferLines: 30_000,
  /* the count of retries, the delays between retries follow an exponential backoff strategy if there is no Retry-After HTTP header */
  maxRetries: 3,
  /* maximum delay between retries in milliseconds */
  maxRetryDelay: 15000,
  /* minimum delay between retries in milliseconds */
  minRetryDelay: 1000, // minimum delay between retries
  /* a random value of up to retryJitter is added when scheduling next retry */
  retryJitter: 1000,
  // ... or you can customize what to do on write failures when using a writeFailed fn, see the API docs for details
  // writeFailed: function(error, lines, failedAttempts){/** return promise or void */},
};
module.exports = {
  connect: () => {
    if (!tokenwrite) {
      return;
    }
    influxclient = new InfluxDB({ url: "http://172.23.176.6:8086", token: tokenwrite });
  },
  write: async (data) => {
    if (!tokenwrite) {
      return;
    }
    let i = 0;
    writeApi = influxclient.getWriteApi(org, bucket, "ns", writeOptions);
    for (let key of data["70997"]) {
      const point1 = new Point("power").tag("location", "70997").floatField("value", key.apparentPower);
      writeApi.writePoint(point1);

      if ((i + 1) % flushBatchSize === 0) {
        console.log(`flush writeApi: chunk #${(i + 1) / flushBatchSize}`);
        try {
          await writeApi.flush();
        } catch (e) {
          console.error();
        }
      }
      i++;
    }

    await writeApi
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
