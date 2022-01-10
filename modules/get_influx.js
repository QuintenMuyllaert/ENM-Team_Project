const path = require('path');
const fs = require('fs');
const { InfluxDB, Point, HttpError } = require('@influxdata/influxdb-client');
const config = fs.existsSync(path.join(__dirname, 'config.json')) ? require('./config.json') : false;
const { url, token, org, bucket } = config;

module.exports = {
  run: async () => {
    try {
      console.log('Reading');
      const queryApi = new InfluxDB({ url, token }).getQueryApi(org);
      const fluxQuery = `from(bucket: "${bucket}") |> range(start: 2020-01-01T00:00:00Z, stop: 2020-01-01T00:00:20Z)`;
      console.log('*** QUERY ROWS ***');
      const api = await queryApi;
      const data = await api.collectRows(fluxQuery);
      // data.forEach((x) => console.log(JSON.stringify(x)));
      console.log('\nCollect ROWS SUCCESS');
      return data;
    } catch (err) {
      console.error(err);
      return;
    }
  },
};
