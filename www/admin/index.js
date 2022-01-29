const socket = io();
const pages = [];
const instantLogin = false; //Don't commit this line!

let connected = false;
let auth = false;
let passwordShow = false;

let htmlUsername, htmlPassword, htmlButtonAuth, htmlButtonShowPassword, htmlControlDidYouKnow, htmlControlHomeSlideLength, htmlControlHomeStaticSlide, htmlControlHome, htmlNavlist;
let pageFunction = {};

let pageNrToEdit = 0;
let tree = {};

pageFunction["./control/slide.html"] = async () => {
  console.log("en zo link je functions die moeten starten als je setting inload");
};

let skeletonSlide = "";
const generateSlide = (html) => {
  return skeletonSlide.replace("<!--INNERHTML-->", html);
};

setInterval(() => {
  dataElements.forEach(async (e) => {
    e.tick();
    e.update();
  });
}, 100);

pageFunction["./control/press.html"] = async () => {
  if (lookupList(tree["slide"], ".html")[pageNrToEdit] == undefined) {
    console.log("out of bounds");
    if (pageNrToEdit < 0) {
      pageNrToEdit = lookupList(tree["slide"], ".html").length - 1;
    } else {
      pageNrToEdit = 0;
    }
  }
  const fileName = "../slide/" + lookupList(tree["slide"], ".html")[pageNrToEdit];

  document.querySelector(".press--number").textContent = pageNrToEdit;

  skeletonSlide = await fetchString("../skeletonSlide.html");
  document.querySelector(".press--slide-viewport").innerHTML = generateSlide(await fetchString(fileName)).replace(/\.\//g, "../");
  const height = document.querySelector(".press--slide-container").offsetHeight;

  const scalefactor = height / 1080;
  document.querySelector(".press--slide-scale").style.transform = `scale(${scalefactor},${scalefactor})`;

  const htmlSlide = document.querySelector(".press--slide-scale").querySelector(".slide--root");
  const textTags = ["P", "H1", "H2", "H3", "H4", "H5", "A", "SPAN", "BUTTON"];

  let selected = null;
  setInterval(() => {
    if (!selected) {
      return;
    }
    if (!textTags.includes(selected.tagName)) {
      return;
    }
    if (selected.getAttribute("dataElement") != null) {
      return;
    }
    selected.innerHTML = document.querySelector(".press-selected-item").value;
  }, 50);

  setInterval(() => {
    if (!selected) {
      return;
    }
    if (selected.getAttribute("dataElement") == null) {
      return;
    }
    selected.setAttribute("dataValue", document.querySelector("#toolbox--dataValue").value);
    selected.setAttribute("dataType", document.querySelector("#toolbox--dataType").value);
  }, 50);

  let htmlCheckboxVis = document.querySelector("input#toolbox--visible");
  htmlCheckboxVis.addEventListener("click", () => {
    console.log(htmlCheckboxVis.checked);
    htmlCheckboxVis.checked = true;
  });

  htmlSlide.addEventListener("click", (event) => {
    document.querySelectorAll(".press--outline").forEach((e) => e.classList.remove("press--outline"));
    if (textTags.includes(event.target.tagName)) {
      document.querySelector(".press-selected-item").value = event.target.innerHTML;
      event.target.classList.add("press--outline");
      selected = event.target;
    } else {
      console.log("not text");
    }
    let dataElement = null;
    if (event.target.getAttribute("dataElement") != null) {
      console.log("Self is dataElement");
      dataElement = event.target;
    } else {
      let e = event.target.parentNode;
      while (e.getAttribute("dataElement") == null) {
        e = e.parentNode;
        if (e.tagName == "BODY") {
          console.log("No dataElement in tree.");
          break;
        }
      }
      if (e.getAttribute("dataElement") != null) {
        console.log("Parent is dataElement");
        dataElement = e;
      }
    }
    if (dataElement != null) {
      selected = dataElement;
      selected.classList.add("press--outline");

      document.querySelector("#toolbox--dataType").value = dataElement.getAttribute("dataType");
      document.querySelector("#toolbox--dataValue").value = dataElement.getAttribute("dataValue");
    } else {
      event.target.classList.add("press--outline");
      selected = event.target;
    }
  });

  const uploader = new SocketIOFileUpload(socket);
  uploader.listenOnInput(document.getElementById("siofu_input"));
  uploader.addEventListener("complete", (e) => {
    selected.src = "../upload/" + e.file.name;
  });

  document.querySelector(".press--undo").addEventListener("click", async () => {
    console.log("Undo-ing changes.");
    document.querySelector(".admin--page-container").innerHTML = await fetchString("./control/press.html");
    await pageFunction["./control/press.html"]();
  });

  document.querySelector(".press--goforward").addEventListener("click", async () => {
    pageNrToEdit++;
    document.querySelector(".admin--page-container").innerHTML = await fetchString("./control/press.html");
    await pageFunction["./control/press.html"]();
  });

  document.querySelector(".press--goback").addEventListener("click", async () => {
    pageNrToEdit--;
    document.querySelector(".admin--page-container").innerHTML = await fetchString("./control/press.html");
    await pageFunction["./control/press.html"]();
  });

  document.querySelector(".press--save").addEventListener("click", async () => {
    console.log("Saving changes.");
    const htmlPage = document.querySelector(".press--slide-viewport").querySelector(".slide--root");

    htmlPage.querySelectorAll(".press--outline").forEach((e) => e.classList.remove("press--outline"));
    const newHtml = htmlPage.innerHTML.replace(/\.\.\//g, "./");

    socket.emit("save", fileName.split("/").pop(), newHtml);
  });
};

pageFunction["./control/home.html"] = async () => {
  skeletonSlide = await fetchString("./control/home.html");
  let html = generateSlide(await fetchString("./control/home.html"));

  htmlControlHomeSlideLength = document.querySelector(".js-home-slide-length");
  htmlControlHomeStaticSlide = document.querySelector(".js-home-static-slide");

  config = await fetchJSON("../config.json");
  staticSlideNr = config.staticSlideNr;
  slideLength = config.slideLength;
  // endAnimationLength = config.endAnimationLength;
  // useScalingFunction = config.useScalingFunction;
  htmlControlHomeSlideLength.value = slideLength;
  htmlControlHomeStaticSlide.value = staticSlideNr;

  htmlControlHomeSubmit = document.querySelector(".js-control-home-submit");

  htmlControlHomeSubmit.addEventListener("click", async () => {
    staticSlideNr = htmlControlHomeSlideLength.value;
    slideLength = htmlControlHomeStaticSlide.value;
  });
};

const pageRender = async () => {
  htmlControlDidYouKnow = document.querySelector(".js-slide-weetjes");
  hmtlControlSlides = document.querySelector(".js-control-slides");
  htmlControlHome = document.querySelector(".js-control-home");

  await loadHomePage();

  htmlControlHome.addEventListener("click", async () => {
    loadHomePage();
  });

  htmlControlDidYouKnow.addEventListener("click", async () => {
    skeletonSlide = await fetchString("./control/slide.html");
    let html = generateSlide(await fetchString("./control/slide.html"));
    document.querySelector(".control--page").innerHTML = html;
    htmlControlDidYouKnowText = document.querySelector(".js-dyk-text");

    didyouknows = await fetchTxt("../data/facts.csv");

    html = "";
    didyouknows.forEach((element) => {
      html += `<h1 class"dyk--text-element">${element}</h1>`;
    });
    htmlControlDidYouKnowText.innerHTML = html;
  });

  htmlControlDidYouKnow.addEventListener("click", async () => {
    skeletonSlide = await fetchString("./control/didyouknow.html");
    let html = generateSlide(await fetchString("./control/didyouknow.html"));
    document.querySelector(".control--page").innerHTML = html;
    htmlControlDidYouKnowText = document.querySelector(".js-dyk-text");

    didyouknows = await fetchTxt("../data/facts.csv");

    html = "";
    didyouknows.forEach((element) => {
      html += `<h1 class"dyk--text-element">${element}</h1>`;
    });
    htmlControlDidYouKnowText.innerHTML = html;
  });
};

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

  socket.on("auth", async (success) => {
    if (success) {
      console.log("Authentication successfull!");
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
  const username = htmlUsername.value;
  const password = htmlPassword.value;
  htmlUsername.disabled = true;
  htmlPassword.disabled = true;
  htmlButtonAuth.disabled = true;
  socket.emit("auth", { username: username, password: password });
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
