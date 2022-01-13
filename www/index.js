const staticSlideNr = -1; //DON'T COMMIT THIS LINE!

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
  return `<main class="slide-content">
        <div class="logo--container">
          <img src="./img/logo.png" alt="logo" />
        </div>
        <div class="slide-content-style">${html}</div>
      </main>`;
};

const addClassRemoveAfter = (element, className, time) => {
  element.classList.add(className);
  setTimeout(() => {
    element.classList.remove(className);
  }, time);
};

const loopHandle = async () => {
  await loop();
  setTimeout(async () => {
    await loopHandle();
  }, 3 * 1000);
};

const loop = async () => {
  slideNr = (slideNr + 1) % pages.length;
  const red = document.querySelector(".animation--container");
  const logo = document.querySelector(".animation--logo-container");

  if (slideNr == 0) {
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
};

const pages = [];
let slideNr = 0;

document.addEventListener("DOMContentLoaded", async () => {
  console.log("loaded!");
  const tree = await fetchJSON("./tree.json");
  const pageNames = lookupList(tree["slide"], ".html");
  for (const page of pageNames) {
    pages.push(await fetchFile(`./slide/${page}`));
  }

  document.querySelector(":root").style.setProperty("--pagecount", pages.length);

  window.scroll({
    top: 0,
    left: 0,
  });

  let html = "";
  if (staticSlideNr == -1) {
    pages.forEach((page) => {
      html += generateSlide(page);
    });
    document.querySelector(".main-container").innerHTML = html;
  } else {
    document.querySelector(".main-container").innerHTML = generateSlide(pages[staticSlideNr]);
  }

  drawChart();
  document.querySelectorAll(".piechart-container").forEach((chart) => {
    drawPie(chart);
  });

  if (staticSlideNr != -1) {
    return;
  }
  loopHandle();
});
