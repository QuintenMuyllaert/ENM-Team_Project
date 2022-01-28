const path = require("path");
const fs = require("fs");
module.exports = {
  config: () => {
    return JSON.parse(fs.readFileSync(path.join(__dirname, "../", "www", "config.json")));
  },
  init: (io) => {
    module.exports.io = io;
    module.exports.control = true;
    module.exports.slideNr = module.exports.config().staticSlideNr;
    module.exports.pageAmount = module.exports.getSlideAmount();
    module.exports.loopHandler();
  },
  getSlideAmount: () => {
    const pages = fs.readdirSync("./www/slide");
    let names = [];
    for (const page of pages) {
      if (page.endsWith(".html")) {
        names.push(page);
      }
    }
    module.exports.pageNames = names;
    module.exports.pageAmount = names.length;
    return module.exports.pageAmount;
  },
  delay: (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  },
  send: (data) => {
    console.log("Sending data to frontend.");
    module.exports.io.emit("slide", data);
  },
  loop: async () => {
    if (module.exports.config().staticSlideNr === -1) {
      module.exports.slideNr = (module.exports.slideNr + 1) % module.exports.getSlideAmount();
    } else {
      module.exports.slideNr = module.exports.config().staticSlideNr;
    }
    module.exports.send(module.exports.config());
    if (module.exports.slideNr == 0 && module.exports.config().showEndAnimation) {
      module.exports.send({ event: "showEndAnimation" });
      await module.exports.delay(1000 * module.exports.config().endAnimationLength);
    }
    module.exports.send({ slideNr: module.exports.slideNr });
  },
  loopHandler: async () => {
    console.log("Loop tick");
    await module.exports.loop();
    setTimeout(async () => {
      await module.exports.loopHandler();
    }, 1000 * module.exports.config().slideLength);
  },
  onConnect: (socket) => {
    console.log("Sending current state to new socket.");
    socket.emit("slide", module.exports.config());
    if (module.exports.config().showEndAnimation) {
      socket.emit("slide", { event: "showEndAnimation" });
    }

    socket.emit("slide", { slideNr: module.exports.slideNr });
  },
};
