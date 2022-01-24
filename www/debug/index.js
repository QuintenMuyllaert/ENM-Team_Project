const socket = io();

let htmlUsername;
let htmlPassword;
let htmlButtonAuth;

socket.on("auth", async (success) => {
  console.log("auth", success);
  if (success) {
    console.log("Authentication successfull!");
    htmlUsername.value = "";
    htmlPassword.value = "";
  } else {
    console.log("Authentication failed!");
    htmlUsername.disabled = false;
    htmlPassword.disabled = false;
    htmlPassword.disabled = false;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const htmlInputSlide = document.querySelector("input#slide");
  const htmlButtonSlide = document.querySelector("button#slide");
  const htmlButtonFacts = document.querySelector("button#facts");
  const htmlButtonQuestions = document.querySelector("button#questions");
  const htmlButtonInit = document.querySelector("button#reinit");
  const htmlButtonShowEndAnimation = document.querySelector("button#endanimation");

  htmlUsername = document.querySelector("input#username");
  htmlPassword = document.querySelector("input#password");
  htmlButtonAuth = document.querySelector("button#login");

  htmlButtonAuth.addEventListener("click", () => {
    const username = htmlUsername.value;
    const password = htmlPassword.value;
    htmlUsername.disabled = true;
    htmlPassword.disabled = true;
    htmlButtonAuth.disabled = true;
    socket.emit("auth", { username: username, password: password });
    console.log("Auth request sent!");
  });

  htmlButtonSlide.addEventListener("click", () => {
    socket.emit("slide", { slideNr: htmlInputSlide.value });
  });

  htmlButtonFacts.addEventListener("click", () => {
    socket.emit("slide", { event: "fetchFacts" });
  });
  htmlButtonQuestions.addEventListener("click", () => {
    socket.emit("slide", { event: "fetchQuestions" });
  });
  htmlButtonInit.addEventListener("click", () => {
    socket.emit("slide", { event: "reinit" });
  });
  htmlButtonShowEndAnimation.addEventListener("click", () => {
    socket.emit("slide", { event: "showEndAnimation" });
  });
});
