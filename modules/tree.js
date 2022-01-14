const path = require("path");
const fs = require("fs");
const util = require("util");

const readdir = util.promisify(fs.readdir);
const lstat = util.promisify(fs.lstat);

const tree = async (root) => {
  const files = await readdir(root).catch((err) => {
    console.error(err);
    return;
  });

  const obj = {};
  for (const file of files) {
    const stat = await lstat(path.join(root, file));
    obj[file] = stat.isDirectory() ? await tree(path.join(root, file)) : 0;
  }
  return obj;
};

module.exports = tree;
