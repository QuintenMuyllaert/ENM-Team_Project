const pages = [];
let config;
let pageNames;
let skeletonSlide = "";
let didyouknow = [];

const elementNumberDay = new dataElement(".js-day", 0, elementDefaultsText);
const elementNumberNight = new dataElement(".js-night", 0, elementDefaultsText);
const elementNumberOneDay = new dataElement(".js-oneday", 0, elementDefaultsText);
const elementNumberDayWeek = new dataElement(".js-dagweek", 0, elementDefaultsText);
const elementNumberNightWeek = new dataElement(".js-nightweek", 0, elementDefaultsText);

const elementChartDayNight = new dataElement(".js-day-night", [0, 0], { ...elementDefaultsChart, init: chartInitDayNight });
const elementChartPie = new dataElement(".duiktank--item-piechart", { title: "kW/h", data: [1, 2, 3, 4], labels: ["label 1", "label 2", "label 3", "label 4"] }, { init: chartPieInit, render: chartPieRender, update: chartPieUpdate });

const generateSlide = (html) => {
  return skeletonSlide.replace("<!--INNERHTML-->", html);
};

const renderDidYouKnow = async () => {
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

const onRenderPage = async (pagename) => {
  dataElements.forEach((e) => {
    e.render();
  });

  document.querySelectorAll(".bubbles").forEach((element) => {
    triggerClass(element, "svg--bubbles");
  });

  renderDidYouKnow();
  renderQuiz();
  slideShow();
};

const showEndAnimation = async () => {
  const red = document.querySelector(".animation--container");
  const logo = document.querySelector(".animation--logo-container");

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

  window.scroll({
    top: 0,
    left: config.slideNr * screen.width,
    behavior: "smooth",
  });
};

const init = async () => {
  config = await fetchJSON("./config.json");
  staticSlideNr = config.staticSlideNr;
  slideLength = config.slideLength;
  endAnimationLength = config.endAnimationLength;
  useScalingFunction = config.useScalingFunction;

  if (useScalingFunction) {
    const width = screen.width;
    const scale = width / 1920;
    document.querySelector("html").style.setProperty("--scalefactor", scale);
  }

  const tree = await fetchJSON("./tree.json");
  didyouknow = await fetchTxt("./data/facts.csv");
  questions = await fetchJSON("./data/questions.json");

  skeletonSlide = await fetchString("./skeletonSlide.html");
  pageNames = lookupList(tree["slide"], ".html");
  if (staticSlideNr == -1) {
    for (const page of pageNames) {
      pages.push(await fetchString(`./slide/${page}`));
    }
  } else {
    pages.push(await fetchString(`./slide/${pageNames[staticSlideNr]}`));
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
  document.querySelector(".main--container").innerHTML = html;
  dataElements.forEach((e) => {
    e.init();
  });
};

const loop = async () => {
  window.scroll({
    top: 0,
    left: config.slideNr * screen.width,
    behavior: "smooth",
  });
  onRenderPage(pageNames[config.slideNr]);
};

window.onresize = () => {
  if (useScalingFunction) {
    const width = screen.width;
    const scale = width / 1920;
    document.querySelector("html").style.setProperty("--scalefactor", scale);
  }

  window.scroll({
    top: 0,
    left: config.slideNr * screen.width,
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  console.log("loaded!");
  await init();
});
