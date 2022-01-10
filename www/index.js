const devMode = true;
const staticSlideNr = 0;

const fetchFile = async (url) => {
  const data = await fetch(url);
  return await data.text();
};

let pages = [];
let slideNr = 0;
const changeSlideContent = (nr) => {
  document.querySelector(".slide-content").innerHTML = pages[nr];
  try {
    drawChart();
  } catch (e) {
    console.error(e);
  }
};

const changeSlide = (nr) => {
  if (!pages.length) {
    return;
  }

  changeSlideContent(slideNr);
  slideNr = slideNr + (1 % pages.length);
};

document.addEventListener("DOMContentLoaded", async () => {
  console.log("loaded!");

  pages.push(await fetchFile("./page1.html"));
  pages.push(await fetchFile("./info.html"));

  if (devMode) {
    changeSlideContent(staticSlideNr);
    return;
  }

  changeSlide();
  let timer = setInterval(() => {
    changeSlide();
  }, 10 * 1000);
});
