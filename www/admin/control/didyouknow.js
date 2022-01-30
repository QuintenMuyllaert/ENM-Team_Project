pageFunction["./control/didyouknow.html"] = async () => {
  const facts = await fetchTxt("../data/facts.csv");
  const factsPreview = document.querySelector(".weetje");
  const factsPlaceholder = document.querySelector(".dyk--container-items");
  let factsString = "";
  for (let fact of facts) {
    factsString += `<div class="dyk--item">
        <input value="${fact}" class="dyk--item-text"></>
        <div class="dyk--item-delete">
          <svg class="dyk--item-delete" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 579.13 579.13"><defs><style>.a{fill:#1d1d1b;}.a,.b{stroke:#1d1d1b;stroke-miterlimit:10;}.b{fill:#1d1d1b;}</style></defs><path class="a" d="M548.1,169.29C388.46,169.29,259,298.71,259,458.35S388.46,747.42,548.1,747.42,837.17,618,837.17,458.35,707.75,169.29,548.1,169.29Zm0,548.05c-143,0-259-116-259-259s116-259,259-259,259,116,259,259S691.14,717.34,548.1,717.34Z" transform="translate(-258.54 -168.79)"/><rect class="b" x="148.94" y="255.19" width="281.25" height="68.75"/></svg>
        </div>
      </div>`;
  }
  factsPlaceholder.innerHTML = factsString;
  const factsHTML = document.querySelectorAll(".dyk--item-text");
  for (let fact of factsHTML) {
    fact.addEventListener("click", () => {
      factsPreview.innerHTML = fact.value;
    });
  }
};

//Is this even needed?
const pageRender = async () => {
  htmlControlDidYouKnow = document.querySelector(".js-slide-weetjes");
  hmtlControlSlides = document.querySelector(".js-control-slides");
  htmlControlHome = document.querySelector(".js-control-home");

  await loadHomePage();

  htmlControlHome.addEventListener("click", async () => {
    loadHomePage();
  });

  htmlControlDidYouKnow.addEventListener("click", async () => {
    skeletonSlide = await fetchString("./control/slide.html");
    let html = generateSlide(await fetchString("./control/slide.html"));
    document.querySelector(".control--page").innerHTML = html;
    htmlControlDidYouKnowText = document.querySelector(".js-dyk-text");

    didyouknows = await fetchTxt("../data/facts.csv");

    html = "";
    didyouknows.forEach((element) => {
      html += `<h1 class"dyk--text-element">${element}</h1>`;
    });
    htmlControlDidYouKnowText.innerHTML = html;
  });

  htmlControlDidYouKnow.addEventListener("click", async () => {
    skeletonSlide = await fetchString("./control/didyouknow.html");
    let html = generateSlide(await fetchString("./control/didyouknow.html"));
    document.querySelector(".control--page").innerHTML = html;
    htmlControlDidYouKnowText = document.querySelector(".js-dyk-text");

    didyouknows = await fetchTxt("../data/facts.csv");

    html = "";
    didyouknows.forEach((element) => {
      html += `<h1 class"dyk--text-element">${element}</h1>`;
    });
    htmlControlDidYouKnowText.innerHTML = html;
  });
};
