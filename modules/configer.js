const fs = require("fs");
const path = require("path");
const configFrontend = fs.existsSync(path.join(__dirname, "../www/config.json")) ? require("../www/config.json") : false;
module.exports = {
  generateFrontend: () => {
    const defaultsFrontend = { staticSlideNr: -1, showEndAnimation: true, useScalingFunction: true, slideLength: 15, endAnimationLength: 5 };
    if (!configFrontend) {
      console.log("Generating frontend config file.");
      fs.writeFileSync("./www/config.json", JSON.stringify(defaultsFrontend, null, 4));
    } else if (JSON.stringify(configFrontend) != JSON.stringify({ ...defaultsFrontend, ...configFrontend })) {
      console.log("Updating frontend config file.");
      fs.writeFileSync("./www/config.json", JSON.stringify({ ...defaultsFrontend, ...configFrontend }, null, 4));
    } else {
      console.log("Nothing to update in config.");
    }
  },
};
