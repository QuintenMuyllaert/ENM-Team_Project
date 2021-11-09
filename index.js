const path = require("path");
const express = require("express");
const app = express();

app.use(express.static(path.join(__dirname, "www")));

app.listen(80, () => {
  console.log("App launched");
});
