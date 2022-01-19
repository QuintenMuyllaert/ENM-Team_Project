const staticSlideNr = -1; //DON'T COMMIT THIS LINE!
const showEndAnimation = true;
const useScalingFunction = true;
const slideLength = 15;
const endAnimationLength = 5000;

const pages = [];
let pageNames;
let slideNr = -1;
let skeletonSlide = "";
let didyouknow = [];

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
  document.querySelector(".js-day").innerText = `Verbruik dag: ${day.toFixed(2)} kW`;
  document.querySelector(".js-night").innerText = `Verbruik nacht: ${night.toFixed(2)} kW`;
  const total = day + night;
  document.querySelector(".js-oneday").innerText = `${total.toFixed(2)}`;

  console.log(day, night);
  drawChartDayNight([day, night]);
});

socket.emit("data", 7);
socket.on("Influx_week", (data) => {
  let night_week = 0;
  let day_week = 0;
  for (waarde of data.TotaalNet) {
    const time = parseInt(waarde._time.split("T")[1].split(":")[0]);
    if (time >= 22 || time < 6) {
      night_week += waarde._value;
    } else {
      day_week += waarde._value;
    }
  }
  night_week = night_week / 1000;
  day_week = day_week / 1000;
  document.querySelector(".js-dagweek").innerText = `${day_week.toFixed(2)}`;
  document.querySelector(".js-nightweek").innerText = `${night_week.toFixed(2)}`;
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

const onRenderPage = async (pagename) => {
  drawChart();
  drawChartDayNight([day, night]);
  document.querySelectorAll(".piechart--container").forEach((chart) => {
    //chart <html>, title "", data [], labels []
    drawPie(chart);
  });

  document.querySelectorAll(".bubbles").forEach((element) => {
    triggerClass(element, "svg--bubbles");
  });

  await delay(1000);
  document.querySelectorAll(".slide--didyouknow-box").forEach(async (element) => {
    element.querySelector(".weetje").innerHTML = didyouknow[Math.round(Math.random() * (didyouknow.length - 1))];
    element.classList.add("slide--didyouknow-animate");
    await delay((slideLength - 1) * 1000);
    element.classList.remove("slide--didyouknow-animate");
    element.classList.add("slide--didyouknow-animate-again");
    await delay(500);
    element.classList.remove("slide--didyouknow-animate-again");
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
    addClassRemoveAfter(red, "animation--display", endAnimationLength);
    addClassRemoveAfter(logo, "animation--logo-display", endAnimationLength);
    await delay(endAnimationLength);
    addClassRemoveAfter(red, "animation--display-reverse", endAnimationLength);
    addClassRemoveAfter(logo, "animation--logo-display-reverse", endAnimationLength);
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
  didyouknow = await fetchJSON("./data/facts.json");

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
