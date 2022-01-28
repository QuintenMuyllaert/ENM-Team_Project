const pages = [];
let pageNames;
let skeletonSlide = "";
let didyouknow = [];

let slideNr, slideLength, endAnimationLength;

//const elementChartDayNight = new dataElement(".js-day-night", [0, 0], { ...elementDefaultsChart, init: chartInitDayNight });

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

const onRenderPage = async () => {
  dataElements.forEach(async (e) => {
    if (!e.hasInit) {
      await e.init();
    }
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
    left: slideNr * screen.width,
    behavior: "smooth",
  });
};

const init = async () => {
  const width = screen.width;
  const scale = width / 1920;
  document.querySelector("html").style.setProperty("--scalefactor", scale);

  const tree = await fetchJSON("./tree.json");
  didyouknow = await fetchTxt("./data/facts.csv");
  questions = await fetchJSON("./data/questions.json");
  comparisons = await fetchJSON("./data/comparisons.json");

  skeletonSlide = await fetchString("./skeletonSlide.html");
  pageNames = lookupList(tree["slide"], ".html");
  for (const page of pageNames) {
    pages.push(await fetchString(`./slide/${page}`));
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
    if (!e.hasInit) {
      e.init();
    }
  });

  if (false) {
    //highlights all items still using a ".js-" class.
    document.querySelectorAll("body *").forEach((element) => {
      if (element.classList.value.includes("js-")) {
        console.log(element.classList.value);
        element.style.backgroundColor = "hotpink";
      }
    });
  }
  await loop();
};

const loop = async () => {
  window.scroll({
    top: 0,
    left: slideNr * screen.width,
    behavior: "smooth",
  });
  onRenderPage();
};

window.onresize = () => {
  const width = screen.width;
  const scale = width / 1920;
  document.querySelector("html").style.setProperty("--scalefactor", scale);

  window.scroll({
    top: 0,
    left: slideNr * screen.width,
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Loaded!");
  await init();
});
