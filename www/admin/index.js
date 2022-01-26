const socket = io();
const pages = [];
const instantLogin = false; //Don't commit this line!

let connected = false;
let auth = false;
let passwordShow = false;

let htmlUsername, htmlPassword, htmlButtonAuth, htmlButtonShowPassword, htmlControlDidYouKnow, htmlControlHomeSlideLength, htmlControlHomeStaticSlide, htmlControlHome, htmlNavlist;
let pageFunction = {};

pageFunction["./control/slide.html"] = async () => {
  console.log("en zo link je functions die moeten starten als je setting inload");
};

let skeletonSlide = "";
const generateSlide = (html) => {
  return skeletonSlide.replace("<!--INNERHTML-->", html);
};

pageFunction["./control/press.html"] = async () => {
  skeletonSlide = await fetchString("../skeletonSlide.html");
  document.querySelector(".press--slide-viewport").innerHTML = generateSlide(await fetchString("../slide/duiktank.html")).replace(/\.\//g, "../");
  const height = document.querySelector(".press--slide-container").offsetHeight;

  const scalefactor = height / 1080;
  document.querySelector(".press--slide-scale").style.transform = `scale(${scalefactor},${scalefactor})`;
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
    pageFunction[htmlFile]();
  } else {
    console.log(`No function associated with "${htmlFile}".`);
  }
};

//Gets called as soon as client has logged in and the page is loaded.
const init = async () => {
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
