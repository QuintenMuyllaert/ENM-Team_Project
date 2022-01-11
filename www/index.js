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
  pages.push(await fetchFile("./geschiedenis.html"));

  let html = "";
  pages.forEach((page) => {
    html += `<main class="slide-content">${page}</main>`;
  });
  document.querySelector(".main-container").innerHTML = html;

  drawChart();
  if (staticSlideNr !== null) {
    window.scroll({
      top: 0,
      left: staticSlideNr * document.body.offsetWidth,
      behavior: "smooth",
    });
    return;
  }

  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });

  setInterval(() => {
    slideNr = (slideNr + 1) % pages.length;
    window.scroll({
      top: 0,
      left: (slideNr / pages.length) * document.body.offsetWidth,
      behavior: "smooth",
    });
  }, 10 * 1000);
});
