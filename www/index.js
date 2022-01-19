const staticSlideNr = -1; //DON'T COMMIT THIS LINE!
const showEndAnimation = true;
const slideLength = 10;

const pages = [];
let pageNames;
let slideNr = 0;
let skeletonSlide = "";

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
    await delay(3000);
  }
  window.scroll({
    top: 0,
    left: (slideNr / pages.length) * document.body.offsetWidth,
    behavior: "smooth",
  });

  console.log(pageNames[slideNr]);

  drawChart();
  document.querySelectorAll(".piechart-container").forEach((chart) => {
    //chart <html>, title "", data [], labels []
    drawPie(chart);
  });

  document.querySelectorAll(".bubbles").forEach((bubble) => {
    console.log(bubble);

    triggerClass(bubble, "svg--bubbles");
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  console.log("loaded!");
  const width = document.body.offsetWidth;
  const scale = (100 * width) / 1920 - 100;
  document.querySelector("html").style["font-size"] = `${100 + 2 * scale}%`;

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

  drawChart();
  drawChartDayNight();
  document.querySelectorAll(".piechart-container").forEach((chart) => {
    //chart <html>, title "", data [], labels []
    drawPie(chart);
  });

  loopHandle();
});
