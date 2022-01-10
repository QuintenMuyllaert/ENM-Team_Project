const path = require('path');
const fs = require('fs');
const express = require('express');
const get_influx = require('./modules/get_influx.js');

const config = fs.existsSync(path.join(__dirname, 'config.json')) ? require('./config.json') : false;

const app = express();

app.use(express.static(path.join(__dirname, 'www')));

app.listen(80, async () => {
  console.log('App launched');
  if (!config) {
    console.log('PLEASE ADD THE CORRECT CONFIG.JSON!!!');
    return;
  }
  const data = await get_influx.run();
  console.log(data);
});
