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
