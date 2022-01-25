//the host is not publically visible on www.
//wanted to use github actions, but this is a temp fix.

//sudo bash start.sh
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const cmdline = (cmd, cb = () => {}) => {
  exec(cmd, (e, stdout) => {
    cb(stdout.toString());
  });
};

const changesToRepo = (branch) => {
  console.log("Changes made to repo!");
  cmdline(`sudo pm2 restart "${branch}"`, () => {
    console.log(`Restarted "${branch}"`);
  });
};

const tick = () => {
  const root = path.join(__dirname, "../");
  console.log(`Pulling repo from Github`);
  const projectName = "ENM-Team_Project";
  const branches = ["dev", "main"];
  for (const branch of branches) {
    cmdline(`cd "${path.join(root, branch, projectName)}" && sudo git pull`, (stdout) => {
      if (stdout == "Already up to date.\n") {
        console.log("Up to date!");
        return;
      }

      cmdline(`cd "${path.join(root, branch, projectName)}" && sudo git reset --hard && sudo git pull`, (stdout) => {
        //changes to repo
        changesToRepo(branch);
      });
      changesToRepo(branch);
    });
  }
};

tick();
setInterval(() => {
  tick();
}, 60 * 1000);
