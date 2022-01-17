//help?
const socket = io();
let connected = false;
let auth = false;
let passwordShow = false;

let usernameHTML, passwordHTML, authButtonHTML, passwordToggle;

socket.on("connect", () => {
  connected = true;
  console.log("Connection to server made!");

  socket.on("auth", (success) => {
    console.log("auth", success);
    if (success) {
      console.log("Authentication successfull!");
      //add green class to fields...
      auth = true;
      usernameHTML.value = "";
      passwordHTML.value = "";
    } else {
      console.log("Authentication failed!");
      //add error class to fields...
      auth = false;
      usernameHTML.disabled = false;
      passwordHTML.disabled = false;
      authButtonHTML.disabled = false;
    }
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
  usernameHTML = document.querySelector(".admin-authentication-login");
  passwordHTML = document.querySelector(".admin-authentication-password");
  authButtonHTML = document.querySelector(".admin-authentication");
  passwordToggle = document.querySelector(".admin-fieldset-password-checkbox");
  passwordIconShow = document.querySelector(".admin-fieldset-password-icon-show");
  passwordIconHide = document.querySelector(".admin-fieldset-password-icon-hide");
  passwordText = document.querySelector(".admin-authentication-password");

  authButtonHTML.addEventListener("click", () => {
    const username = usernameHTML.value;
    const password = passwordHTML.value;
    usernameHTML.disabled = true;
    passwordHTML.disabled = true;
    authButtonHTML.disabled = true;
    socket.emit("auth", { username: username, password: password });
    console.log("Auth request sent!");
  });

  passwordToggle.addEventListener("change", () => {
    console.log("test");
    if (passwordShow == false){
      passwordIconShow.classList.add("o-hide-accessible");
      passwordIconHide.classList.remove("o-hide-accessible");
      passwordShow = true;
      passwordText.type="text";
    } else {
      passwordIconShow.classList.remove("o-hide-accessible");
      passwordIconHide.classList.add("o-hide-accessible");
      passwordShow = false;
      passwordText.type="password";
    }
  });
});
