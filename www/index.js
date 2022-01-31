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

  let vergelijking = document.querySelectorAll(".js-vergelijking");
  let vergelijking_icons = document.querySelectorAll(".js-vergelijking-icons");
  index = 0;
  vergelijking.forEach((element) => {
    let vergelijking_data = element.innerHTML;
    console.log(vergelijking_data);
    console.log(Math.floor(vergelijking_data / 15.1));
    i = Math.floor(vergelijking_data / 15.1);
    let html = "";
    while ((i == 1, i--)) {
      html += `<svg id="auto" class="svg--auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144.44 72.32">
      <defs>
        <style>
          .cls-carroserie {
            fill: red;
          }
  
          .cls-wielen {
            fill: #cf1c24;
          }
  
          .cls-raam {
            fill: white;
          }
  
          .cls-prieze {
            fill: none;
            stroke: #000;
            stroke-miterlimit: 10;
          }
        </style>
      </defs>
      <g class="svg--auto-carroserie">
        <path id="carroserie" class="cls-carroserie" d="M150.07,74.79c-3.42-.68-7.54-.87-13.08-1.62-.49-.07-1.58-.21-3-.54a37.6,37.6,0,0,1-4-1.21c-7.48-2.65-11-6.73-24.64-10.21-.65-.16-1.86-.48-3.54-.86A84.93,84.93,0,0,0,90,58.58a58.44,58.44,0,0,0-15.57.47c-6.82,1.27-12.47,4.85-23.76,12a54.35,54.35,0,0,0-12,10.07c-.26.3-.4.46-.54.64-4,5.07-2.86,13.58-.42,17.34,1.36,2.08,3.39,3.1,7.07,3.57a12.94,12.94,0,0,1-.14-1.77,13.14,13.14,0,1,1,26.28,0,13.53,13.53,0,0,1-.14,1.81h.75c12.57-.18,25.14,0,37.71,0,7.09,0,11.82,0,15,0a13.38,13.38,0,0,1-.14-1.8,13.14,13.14,0,1,1,26.28,0c0,.23,0,.47,0,.7a13.43,13.43,0,0,0,13.36-8.36c2.15-5.67-.48-11.53-3.7-14.36C157.15,76.35,153.91,75.57,150.07,74.79Z" transform="translate(-20.07 -38.7)" />
        <path id="raam" class="cls-raam" d="M62.84,76.19c0-7.47,10.51-13.52,23.49-13.52s23.49,6,23.49,13.52" transform="translate(-20.07 -38.7)" />
      </g>
  
      <g class="svg--auto-wielen" id="wielen">
        <circle id="wiel_1" data-name="wiel 1" class="cls-wielen" cx="116.98" cy="62.2" r="10.12" />
        <circle id="wiel_2" data-name="wiel 2" class="cls-wielen" cx="37.36" cy="62.01" r="10.12" />
      </g>
  
      <g id="prieze">
        <g>
          <path class="cls-prieze" d="M20.57,75.47a14.93,14.93,0,0,0,14.92,15" transform="translate(-20.07 -38.7)" />
          <path class="cls-prieze" d="M20.57,75.47c0-15.78,22.12-28.56,49.45-28.56" transform="translate(-20.07 -38.7)" />
        </g>
        <path d="M83.79,49.51H78V43.72h5.78a1.45,1.45,0,0,0,0-2.89H78V38.7a8,8,0,1,0,0,16V52.4h5.78a1.45,1.45,0,0,0,0-2.89Z" transform="translate(-20.07 -38.7)" />
      </g>
    </svg>   `;
    }
    vergelijking_icons[index].innerHTML = html;
    index += 1;
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
