const staticSlideNr = -1;

const fetchFile = async (url) => {
  const data = await fetch(url);
  return await data.text();
};

let pages = [];
let slideNr = null;

document.addEventListener("DOMContentLoaded", async () => {
  console.log("loaded!");

  pages.push(await fetchFile("./page1.html"));
  pages.push(await fetchFile("./info.html"));
  pages.push(await fetchFile("./geschiedenis.html"));

  let html = "";
  if (staticSlideNr == -1) {
    pages.forEach((page) => {
      html += `<main class="slide-content">${page}</main>`;
    });
    document.querySelector(".main-container").innerHTML = html;
  } else {
    document.querySelector(".main-container").innerHTML = `<main class="slide-content">${pages[staticSlideNr]}</main>`;
  }

  drawChart();

  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });

  if (staticSlideNr != -1) {
    return;
  }

  setInterval(() => {
    slideNr = (slideNr + 1) % pages.length;
    window.scroll({
      top: 0,
      left: (slideNr / pages.length) * document.body.offsetWidth,
      behavior: "smooth",
    });
  }, 3 * 1000);
});
