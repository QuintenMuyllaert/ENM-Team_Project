const path = require('path');
const express = require('express');
const { InfluxDB, Point, HttpError } = require('@influxdata/influxdb-client');
const { url, token, org, bucket } = require('./config.json');

const app = express();

app.use(express.static(path.join(__dirname, 'www')));

app.listen(80, () => {
  console.log('App launched');
  
  const queryApi = new InfluxDB({ url, token }).getQueryApi(org);
  const fluxQuery = `from(bucket: "${bucket}") |> range(start: 2020-01-01T00:00:00Z, stop: 2020-01-01T00:00:20Z)`;
  console.log('*** QUERY ROWS ***');
  queryApi.queryRows(fluxQuery, {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row);
      console.log(`${o._time} ${o._measurement} is '${o._value}': ${o._field}=${o._value}`);
    },
    error(error) {
      console.error(error);
      console.log('\nFinished ERROR');
    },
    complete() {
      console.log('\nFinished SUCCESS');
    },
  });
});
