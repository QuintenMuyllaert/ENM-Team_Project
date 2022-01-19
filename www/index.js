const staticSlideNr = -1; //DON'T COMMIT THIS LINE!
const showEndAnimation = true;
const useScalingFunction = true;
const slideLength = 10;

const pages = [];
let pageNames;
let slideNr = 0;
let skeletonSlide = "";

let day = 0;
let night = 0;
socket.emit("data", 1);
socket.on("Influx", (data) => {
  console.log(data);

  for (waarde of data.TotaalNet) {
    const time = parseInt(waarde._time.split("T")[1].split(":")[0]);
    if (time >= 22 || time < 6) {
      night += waarde._value;
    } else {
      day += waarde._value;
    }
  }
  night = night / 1000;
  day = day / 1000;
  console.log(day, night);
  drawChartDayNight([day, night]);
});
const delay = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

const fetchFile = async (url) => {
  const data = await fetch(url);
  return await data.text();
};

const fetchJSON = async (url) => {
  const data = await fetch(url);
  return await data.json();
};

const lookupList = (list, includes) => {
  const results = [];
  list = Object.keys(list);
  for (const item of list) {
    if (item.includes(includes)) {
      results.push(item);
    }
  }
  return results;
};

const generateSlide = (html) => {
  return skeletonSlide.replace("<!--INNERHTML-->", html);
};

const addClassRemoveAfter = (element, className, time) => {
  element.classList.add(className);
  setTimeout(() => {
    element.classList.remove(className);
  }, time);
};

const triggerClass = async (element, className) => {
  element.classList.remove(className);
  await delay(10);
  element.classList.add(className);
};

const onRenderPage = (pagename) => {
  drawChart();
  drawChartDayNight([day, night]);
  document.querySelectorAll(".piechart--container").forEach((chart) => {
    //chart <html>, title "", data [], labels []
    drawPie(chart);
  });

  document.querySelectorAll(".bubbles").forEach((element) => {
    triggerClass(element, "svg--bubbles");
  });

  document.querySelectorAll(".slide--didyouknow-box").forEach((element) => {
    //triggerClass(element, "slide--didyouknow-animate");
  });
};

const loopHandle = async () => {
  await loop();
  setTimeout(async () => {
    await loopHandle();
  }, slideLength * 1000);
};

const loop = async () => {
  slideNr = (slideNr + 1) % pages.length;
  const red = document.querySelector(".animation--container");
  const logo = document.querySelector(".animation--logo-container");

  if (showEndAnimation && slideNr == 0) {
    addClassRemoveAfter(red, "animation--display", 3000);
    addClassRemoveAfter(logo, "animation--logo-display", 3000);
    await delay(3000);
    addClassRemoveAfter(red, "animation--display-reverse", 3000);
    addClassRemoveAfter(logo, "animation--logo-display-reverse", 3000);
    window.scroll({
      top: 0,
      left: 0,
    });
    await delay(1500);
  }
  window.scroll({
    top: 0,
    left: slideNr * screen.width,
    behavior: "smooth",
  });

  onRenderPage(pageNames[slideNr]);
};

window.onresize = () => {
  if (useScalingFunction) {
    const width = screen.width;
    const scale = width / 1920;
    document.querySelector("html").style.setProperty("--scalefactor", scale);
  }

  window.scroll({
    top: 0,
    left: slideNr * screen.width,
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  console.log("loaded!");
  if (useScalingFunction) {
    const width = screen.width;
    const scale = width / 1920;
    document.querySelector("html").style.setProperty("--scalefactor", scale);
  }

  const tree = await fetchJSON("./tree.json");
  skeletonSlide = await fetchFile("./skeletonSlide.html");
  pageNames = lookupList(tree["slide"], ".html");
  if (staticSlideNr == -1) {
    for (const page of pageNames) {
      pages.push(await fetchFile(`./slide/${page}`));
    }
  } else {
    pages.push(await fetchFile(`./slide/${pageNames[staticSlideNr]}`));
  }

  document.querySelector(":root").style.setProperty("--pagecount", pages.length);

  window.scroll({
    top: 0,
    left: 0,
  });

  let html = "";
  pages.forEach((page) => {
    html += generateSlide(page);
  });
  document.querySelector(".main-container").innerHTML = html;

  loopHandle();
});
