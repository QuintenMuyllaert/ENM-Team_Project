from(bucket: "Transfosite") |> range(start: 2022-01-24T00:00:00Z, stop: 2022-01-24T16:00:00Z) |> aggregateWindow(every: 1h, fn: last, createEmpty: false)
    |> toString()
    |> group(columns: ["_field*", "_field"], mode: "by")
    |> distinct(column: "_field*")
// |> filter(fn: (r) => r._field == "net")
// delete bucket data
// const { DeleteAPI } = require("@influxdata/influxdb-client-apis");
// const deleteAPI = new DeleteAPI(influxclient);
//     // define time interval for delete operation
//     const stop = new Date();
//     const start = new Date(stop.getTime() - /* an hour */ 60 * 600 * 1000);
//     await deleteAPI.postDelete({
//       org,
//       bucket,
//       // you can better specify orgID, bucketID in place or org, bucket if you already know them
//       body: {
//         start: start.toISOString(),
//         stop: stop.toISOString(),
//         // see https://docs.influxdata.com/influxdb/v2.1/reference/syntax/delete-predicate/
//         predicate: '_measurement="power"',
//       },
//     });
//   },