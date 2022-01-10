const path = require('path');
const fs = require('fs');
const express = require('express');
const { InfluxDB, Point, HttpError } = require('@influxdata/influxdb-client');
const { deflateSync } = require('zlib');

const config = fs.existsSync(path.join(__dirname, 'config.json')) ? require('./config.json') : false;
const { url, token, org, bucket } = config;

const get_influx = async () => {
  try {
    const queryApi = new InfluxDB({ url, token }).getQueryApi(org);
    const fluxQuery = `from(bucket: "${bucket}") |> range(start: 2020-01-01T00:00:00Z, stop: 2020-01-01T00:00:20Z)`;
    console.log('*** QUERY ROWS ***');
    const api = await queryApi;
    const data = await api.collectRows(fluxQuery);
    // data.forEach((x) => console.log(JSON.stringify(x)));
    console.log('\nCollect ROWS SUCCESS');
    return await data;
  } catch (err) {
    console.error(err);
    return;
  }
};

const app = express();

app.use(express.static(path.join(__dirname, 'www')));

app.listen(80, async () => {
  console.log('App launched');
  if (!config) {
    console.log('PLEASE ADD THE CORRECT CONFIG.JSON!!!');
    return;
  }
  const data = await get_influx();
  console.log(data);
});
