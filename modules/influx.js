const path = require("path");
const fs = require("fs");
const { InfluxDB } = require("@influxdata/influxdb-client");
const config = fs.existsSync(path.join(__dirname, "../config.json")) ? require("../config.json") : false;
const { getSunset, getSunrise } = require("sunrise-sunset-js");

module.exports = {
  lastHour: {},
  lastWeek: {},
  queryApi: false,
  connect: () => {
    const { url, token, org } = config;
    if (!url) {
      console.log("NO URL PROVIDED FOR INFLUXDB!");
      return;
    }
    console.log("Setting basisy.");
    module.exports.oneSecond = 1;
    module.exports.oneMinute = 60 * module.exports.oneSecond;
    module.exports.oneHour = 60 * module.exports.oneMinute;
    module.exports.oneDay = 24 * module.exports.oneHour;
    module.exports.oneWeek = 7 * module.exports.oneDay;
    module.exports.oneMonth = 30.4368499 * module.exports.oneDay;
    module.exports.oneYear = 365.242199 * module.exports.oneDay;

    console.log("Connecting.");
    module.exports.queryApi = new InfluxDB({ url, token }).getQueryApi(org);
  },
  run: async (querry) => {
    if (!module.exports.queryApi) {
      console.log("Not connected to the database!");
      return false;
    }

    try {
      console.log("Executing  querry.");
      const data = await module.exports.queryApi.collectRows(querry);
      console.log("Received data!");
      return data;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
  calculateDayNight: (data, basis) => {
    //hours (server time) we see as morning / evening
    //morning <= time < evening = day
    //!day = night
    const cords = [50.81268, 3.33848];
    const morning = new Date(getSunrise(...cords)).getHours();
    const evening = new Date(getSunset(...cords)).getHours();

    let listdag = 0;
    let listnacht = 0;

    let lenDag = 0;
    let lenNacht = 0;

    for (const thing of data) {
      if (thing.time) {
        const time = parseInt(thing.time.split("T")[1].split(":")[0]);
        if (time < evening && time >= morning) {
          listdag += thing.val;
          lenDag++;
        } else {
          listnacht += thing.val;
          lenNacht++;
        }
      }
    }

    return {
      day: {
        total: (listdag / lenDag) * (basis / module.exports.oneHour),
        avg: listdag / lenDag,
      },
      night: {
        total: (listnacht / lenNacht) * (basis / module.exports.oneHour),
        avg: listnacht / lenNacht,
      },
    };
  },
  sanitize: async (io) => {
    const timelabels = ["minuit", "uur", "dag", "week", "maand", "jaar"];
    const basisy = [module.exports.oneMinute, module.exports.oneHour, module.exports.oneHour, module.exports.oneHour, module.exports.oneDay, module.exports.oneMonth];
    const amt = [1 / 24 / 60, 1 / 24, 1, 8, 31, 357];

    const dataByMeter = {};
    for (const i in timelabels) {
      const basis = basisy[i];
      const label = timelabels[i];
      const data = await module.exports.fetch(amt[i], basis);

      for (const thing of data) {
        const obj = {
          val: thing._value,
          time: thing._time,
        };
        if (!dataByMeter[thing._field]) {
          dataByMeter[thing._field] = {};
        }
        if (!dataByMeter[thing._field][label]) {
          dataByMeter[thing._field][label] = { data: [obj], basis: label };
        } else {
          dataByMeter[thing._field][label].data.unshift(obj);
        }
      }

      const meters = Object.keys(dataByMeter);
      for (const meter of meters) {
        let sum = 0;
        const len = dataByMeter[meter][label].data.length;
        for (const point of dataByMeter[meter][label].data) {
          sum += point.val;
        }
        const avg = sum / len; // = W
        const tot = avg * (basis / module.exports.oneHour); // = W/basis
        dataByMeter[meter][label].gemiddeld = avg;
        dataByMeter[meter][label].totaal = tot;
        if (basis == module.exports.oneHour) {
          const dayNight = module.exports.calculateDayNight(dataByMeter[meter][label].data, basisy);
          dataByMeter[meter][label].overdag = {
            gemiddeld: dayNight.night.avg,
            totaal: dayNight.night.total,
          };
          dataByMeter[meter][label].snachts = {
            gemiddeld: dayNight.day.avg,
            totaal: dayNight.day.total,
          };
        }
      }
    }

    const meters = Object.keys(dataByMeter);
    for (const meter of meters) {
      //#Blame Senne & CO
      if (!dataByMeter[meter]["dag"]) {
        delete dataByMeter[meter];
      }
    }

    console.log("Sending data to socket");
    module.exports.data = dataByMeter;
    io.emit("influxData", dataByMeter);
  },
  secondsToDays: (s) => {
    const oneDayInSeconds = 60 * 60 * 24;
    return s / oneDayInSeconds;
  },
  fetch: async (days, basis) => {
    if (!config) {
      console.log("PLEASE ADD THE CORRECT CONFIG.JSON!!!");
      return;
    }
    console.log("Attempting to fetch data from InfluxDB.");
    console.log(days);
    let today = new Date(Date.now());
    today.setHours(1, 0, 0, 0);
    const stopdate = today.toISOString();
    today = today.minusDays(days);
    const startdate = today.toISOString();
    const querry = `from(bucket: "${config.bucket}") |> range(start: ${startdate}, stop: ${stopdate}) |> aggregateWindow(every: ${Math.round(basis)}s, fn: mean, createEmpty: false) `;
    const data = await module.exports.run(querry);

    if (!data) {
      console.log("Something went wrong while fetching data!\nGot empty data object, possibly because the database is offline.");
      return;
    }

    return data;
  },
  fetchPeriodically: async (io) => {
    console.log("First periodical fetch of the data.");
    //await module.exports.fetch(io, 1);
    //await module.exports.fetch(io, 7);

    await module.exports.sanitize(io);
    setInterval(async () => {
      console.log("Periodical fetch of the data.");
      await module.exports.sanitize(io);
      //await module.exports.fetch(io, 1);
      //await module.exports.fetch(io, 7);
    }, 60 * 1000);
  },
};
