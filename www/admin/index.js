const socket = io();
const pages = [];
let connected = false;
let auth = false;
let passwordShow = false;

let htmlUsername, htmlPassword, htmlButtonAuth, htmlButtonShowPassword, htmlControlDidYouKnow,htmlControlHomeSlideLength, htmlControlHomeStaticSlide, htmlControlHome;
let skeletonSlide = "";
const generateSlide = (html) => {
  return skeletonSlide.replace("<!--INNERHTML-->", html);
};

const loadHomePage = async () => {
  skeletonSlide = await fetchString("./control/home.html");
  let html = generateSlide(await fetchString("./control/home.html"));

  document.querySelector(".control--page").innerHTML = html;

  htmlControlHomeSlideLength = document.querySelector(".js-home-slide-length");
  htmlControlHomeStaticSlide = document.querySelector(".js-home-static-slide");

  config = await fetchJSON("../config.json");
  staticSlideNr = config.staticSlideNr;
  slideLength = config.slideLength;
  endAnimationLength = config.endAnimationLength;
  useScalingFunction = config.useScalingFunction;
  htmlControlHomeSlideLength.value = slideLength;
  htmlControlHomeStaticSlide.value = staticSlideNr;
};


const pageRender = async () => {
  htmlControlDidYouKnow = document.querySelector(".js-slide-weetjes");
  htmlControlHome = document.querySelector(".js-control-home");

  loadHomePage();

  htmlControlHome.addEventListener("click", async () => {
    loadHomePage();
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

socket.on("connect", () => {
  connected = true;
  console.log("Connection to server made!");

  socket.on("auth", async (success) => {
    if (success) {
      console.log("Authentication successfull!");
      //add green class to fields...
      auth = true;
      htmlUsername.value = "";
      htmlPassword.value = "";
    } else {
      console.log("Authentication failed!");
      //add error class to fields...
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

    document.querySelector("body").innerHTML = await fetchString("./control/index.html");
    pageRender();
  });

  socket.on("admin", (data) => {
    //server will only send data if auth
  });

  socket.on("close", () => {
    connected = false;
    console.log("Connection to server closed!");
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  htmlUsername = document.querySelector(".admin--authentication-login");
  htmlPassword = document.querySelector(".admin--authentication-password");
  htmlButtonAuth = document.querySelector(".admin--authentication");
  htmlButtonShowPassword = document.querySelector(".admin--fieldset-password-checkbox");
  htmlIconShowPassword = document.querySelector(".admin--fieldset-password-icon-show");
  htmlIconHidePassword = document.querySelector(".admin--fieldset-password-icon-hide");

  htmlButtonAuth.addEventListener("click", () => {
    const username = htmlUsername.value;
    const password = htmlPassword.value;
    htmlUsername.disabled = true;
    htmlPassword.disabled = true;
    htmlButtonAuth.disabled = true;
    socket.emit("auth", { username: username, password: password });
    console.log("Auth request sent!");
  });

  htmlButtonShowPassword.addEventListener("change", () => {
    passwordShow = !passwordShow;
    htmlIconShowPassword.classList[passwordShow ? "add" : "remove"]("o-hide-accessible");
    htmlIconHidePassword.classList[!passwordShow ? "add" : "remove"]("o-hide-accessible");
    htmlPassword.type = passwordShow ? "text" : "password";
  });
});
