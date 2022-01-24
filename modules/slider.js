const fs = require("fs");
module.exports = {
  init: (io) => {
    module.exports.io = io;
    module.exports.control = true;
    module.exports.config = require("../www/config.json");
    module.exports.slideNr = 0;
    module.exports.pageAmount = module.exports.getSlideAmount();
    console.log("help");
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
    module.exports.io.emit("slide", data);
  },
  loop: async () => {
    if (module.exports.slideNr == 0) {
      module.exports.send({ event: "showEndAnimation" });
      await module.exports.delay(module.exports.config.endAnimationLength);
    }
    module.exports.send({ slideNr: module.exports.slideNr });
    module.exports.slideNr = (module.exports.slideNr + 1) % module.exports.getSlideAmount();
  },
  loopHandler: async () => {
    console.log("Loop tick");
    await module.exports.loop();
    setTimeout(async () => {
      await module.exports.loopHandler();
    }, 1000 * module.exports.config.slideLength);
  },
};
