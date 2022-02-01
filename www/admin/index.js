const loadPageContent = async (e) => {
  const htmlFile = e.getAttribute("htmlFile");

  htmlNavlist.querySelectorAll(".selected").forEach((e) => {
    e.classList.remove("selected");
  });
  e.classList.add("selected");
  document.querySelector(".admin--page-container").innerHTML = await fetchString(htmlFile);
  if (pageFunction[htmlFile]) {
    pageFunction[htmlFile](htmlFile);
  } else {
    console.log(`No function associated with "${htmlFile}".`);
  }
};

//Gets called as soon as client has logged in and the page is loaded.
const init = async () => {
  tree = await fetchJSON("../tree.json");
  document.querySelector(".admin--profile-name").textContent = username;
  //Queryselectors

  htmlNavlist = document.querySelector(".admin--nav-list");

  //Event listeners
  for (const e of htmlNavlist.children) {
    e.addEventListener("click", async () => {
      await loadPageContent(e);
    });
  }

  const htmlNavSelected = htmlNavlist.querySelector(".selected");
  if (htmlNavSelected) {
    loadPageContent(htmlNavSelected);
  }
};

socket.on("connect", () => {
  connected = true;
  console.log("Connection to server made!");

  socket.on("2FA", (data) => {
    if (data == "exist") {
      const exist = document.querySelector(".js-recovery");
      exist.innerHTML = `<label class="admin--fieldset-label admin--fieldset-recovery" for="recovery">Recovery</label>
      <input class="admin--fieldset-input admin--fieldset-recovery admin--qrcode js-field--recovery" type="text" id="recovery" />`;
    }
  });

  socket.on("auth", async (success) => {
    if (success) {
      console.log("Authentication successfull!");

      username = htmlUsername.value;

      //TODO! add green class to fields...
      auth = true;
      htmlUsername.value = "";
      htmlPassword.value = "";
    } else {
      console.log("Authentication failed!");
      //TODO! add error class to fields...
      auth = false;
      htmlUsername.disabled = false;
      htmlPassword.disabled = false;
      htmlPassword.disabled = false;
    }

    htmlUsername.classList[!auth ? "add" : "remove"]("admin--authentication-error");
    htmlPassword.classList[!auth ? "add" : "remove"]("admin--authentication-error");
    htmlUsername.classList[auth ? "add" : "remove"]("admin--authentication-success");
    htmlPassword.classList[auth ? "add" : "remove"]("admin--authentication-success");

    if (!auth) {
      return;
    }

    //replace entire body with main dashboard.
    document.querySelector("body").innerHTML = await fetchString("./control/index.html");
    init();
  });
  socket.on("qrcode", async (data) => {
    console.log(data);
    const code = document.querySelector(".js-qrcode");
    code.src = data;
  });
  socket.on("influxData", (data) => {
    console.log("Got processed influx data!");
    //influx variable is a global variable that stores the latest influx data point.
    influx = data;

    //Update all dataElements elements
    console.log(influx);
    dataElements.forEach(async (e) => {
      e.tick();
    });
  });

  socket.on("admin", (data) => {
    //server will only send data if auth
  });

  socket.on("close", () => {
    connected = false;
    console.log("Connection to server closed!");
  });
});

const authFunction = () => {
  let recover = document.querySelector(".js-field--recovery");
  if (!recover) {
    recover = "";
  }
  if (recover.value != "" && recover != "") {
    recover.value.replace(/ /g, "");
    socket.emit("forget", recover.value);
  } else {
    const username = htmlUsername.value;
    const password = htmlPassword.value;
    htmlUsername.disabled = true;
    htmlPassword.disabled = true;
    htmlButtonAuth.disabled = true;
    socket.emit("auth", { username: username, password: password });
  }
  console.log("Auth request sent!");
};

document.addEventListener("DOMContentLoaded", async () => {
  //Queryselectors
  htmlUsername = document.querySelector(".admin--authentication-login");
  htmlPassword = document.querySelector(".admin--authentication-password");
  htmlButtonAuth = document.querySelector(".admin--authentication");
  htmlButtonShowPassword = document.querySelector(".admin--fieldset-password-checkbox");
  htmlIconShowPassword = document.querySelector(".admin--fieldset-password-icon-show");
  htmlIconHidePassword = document.querySelector(".admin--fieldset-password-icon-hide");

  //Debug override functions
  if (instantLogin) {
    authFunction();
  }

  //Event listeners
  htmlButtonAuth.addEventListener("click", authFunction);

  htmlButtonShowPassword.addEventListener("change", () => {
    passwordShow = !passwordShow;
    htmlIconShowPassword.classList[passwordShow ? "add" : "remove"]("o-hide-accessible");
    htmlIconHidePassword.classList[!passwordShow ? "add" : "remove"]("o-hide-accessible");
    htmlPassword.type = passwordShow ? "text" : "password";
  });
});
