const staticSlideNr = 3; //DON'T COMMIT THIS LINE!

const delay = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

const fetchFile = async (url) => {
  const data = await fetch(url);
  return await data.text();
};

let pages = [];
let slideNr = null;

document.addEventListener("DOMContentLoaded", async () => {
  console.log("loaded!");

  pages.push(await fetchFile("./slide/page1.html"));
  pages.push(await fetchFile("./slide/info.html"));
  pages.push(await fetchFile("./slide/geschiedenis.html"));
  pages.push(await fetchFile("./slide/svgtest.html"));

  let html = "";
  if (staticSlideNr == -1) {
    pages.forEach((page) => {
      console.log("found page");
      html += `<main class="slide-content">
        <div class="logo--container">
          <img src="./img/logo.png" alt="logo" />
        </div>
        <div class="slide-content-style">${page}</div>
      </main>`;
    });
    document.querySelector(".main-container").innerHTML = html;
  } else {
    document.querySelector(".main-container").innerHTML = `<main class="slide-content">
        <div class="logo--container">
          <img src="./img/logo.png" alt="logo" />
        </div>
        <div class="slide-content-style">${pages[staticSlideNr]}</div>
      </main>`;
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

  const loopHandle = async () => {
    await loop();
    setTimeout(async () => {
      await loopHandle();
    }, 3 * 1000);
  };

  const loop = async () => {
    slideNr = (slideNr + 1) % pages.length;
    if (slideNr == 0) {
      document.querySelector(".animation--container").classList.add("animation--display");
      document.querySelector(".animation--logo-container").classList.add("animation--logo-display");
      await delay(3000);

      document.querySelector(".animation--container").classList.add("animation--display-reverse");
      document.querySelector(".animation--logo-container").classList.add("animation--logo-display-reverse");
      document.querySelector(".animation--container").classList.remove("animation--display");
      document.querySelector(".animation--logo-container").classList.remove("animation--logo-display");
      window.scroll({
        top: 0,
        left: 0,
      });
      await delay(3000);
      document.querySelector(".animation--container").classList.remove("animation--display-reverse");
      document.querySelector(".animation--logo-container").classList.remove("animation--logo-display-reverse");
    }
    window.scroll({
      top: 0,
      left: (slideNr / pages.length) * document.body.offsetWidth,
      behavior: "smooth",
    });
  };

  loopHandle();
});
