const socket = io();
const pages = [];
let connected = false;
let auth = false;
let passwordShow = false;

let htmlUsername, htmlPassword, htmlButtonAuth, htmlButtonShowPassword;

socket.on("connect", () => {
  connected = true;
  console.log("Connection to server made!");

  socket.on("auth", async (success) => {
    console.log("auth", success);
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

  htmlControlWeetjes = document.querySelector(".js-weetjes");

  htmlControlWeetjes.addEventListener("click", () => {
    let html = "";
    pages.forEach((page) => {
      html += generateSlide(page);
    });
    document.querySelector(".control--page").innerHTML = html;
    dataElements.forEach((e) => {
      e.init();
    });
  });
});
