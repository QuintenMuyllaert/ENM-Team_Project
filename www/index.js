const fetchFile = async (url) => {
  const data = await fetch(url);
  return await data.text();
};

let pages = [];
let slideNr = 0;
const changeSlide = () => {
  if (!pages.length) {
    return;
  }
  document.querySelector(".slide-content").innerHTML = pages[slideNr];
  slideNr = slideNr + (1 % pages.length);
};

document.addEventListener("DOMContentLoaded", async () => {
  console.log("loaded!");
  pages.push(await fetchFile("./page1.html"));

  changeSlide();
  let timer = setInterval(() => {
    changeSlide();
  }, 10 * 1000);
});
