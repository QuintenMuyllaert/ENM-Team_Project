let activeFact = null;

setInterval(() => {
  if (!activeFact) {
    return;
  }
  const preview = document.querySelector(".weetje");
  if (!preview) {
    return;
  }
  preview.innerHTML = activeFact.value;
}, 50);

pageFunction["./control/didyouknow.html"] = async () => {
  const facts = await fetchTxt("../data/facts.csv");
  const factsPreview = document.querySelector(".weetje");
  let factsPlaceholder = document.querySelector(".dyk--container-items");
  const newfact = document.querySelector(".dyk--item-add");
  const submit = document.querySelector(".js-send");
  const space = document.querySelector(".js-space");
  const bold = document.querySelector(".js-bold");
  let factsString = "";
  let text = "";

  let i = 0;

  for (let fact of facts) {
    factsString += `<div class="dyk--item">
        <input id="${i}" value="${fact}" class="dyk--item-text"></>
        <div id="del${i}"  class="dyk--item-delete">
          <svg class="dyk--item--delete" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 579.13 579.13"><defs><style>.a{fill:#1d1d1b;}.a,.b{stroke:#1d1d1b;stroke-miterlimit:10;}.b{fill:#1d1d1b;}</style></defs><path class="a" d="M548.1,169.29C388.46,169.29,259,298.71,259,458.35S388.46,747.42,548.1,747.42,837.17,618,837.17,458.35,707.75,169.29,548.1,169.29Zm0,548.05c-143,0-259-116-259-259s116-259,259-259,259,116,259,259S691.14,717.34,548.1,717.34Z" transform="translate(-258.54 -168.79)"/><rect class="b" x="148.94" y="255.19" width="281.25" height="68.75"/></svg>
        </div>
      </div>`;
    i++;
  }
  factsPlaceholder.innerHTML = factsString;

  bold.addEventListener("click", () => {
    if (window.getSelection) {
      text = window.getSelection().toString();
    }
    if (text == "" || text == " ") {
      return;
    }
    for (item of document.querySelectorAll(".dyk--item-text")) {
      if (item.value.includes(text)) {
        const start = item.value;
        const newtext = `${start.split(text)[0]}<span>${text}</span>${start.split(text)[1]}`;
        item.value = newtext;
      }
    }
  });
  space.addEventListener("click", () => {
    if (window.getSelection) {
      text = window.getSelection().toString();
    }
    if (text == "" || text == " ") {
      return;
    }
    for (item of document.querySelectorAll(".dyk--item-text")) {
      if (item.value.includes(text)) {
        const start = item.value;
        const newtext = `${start.split(text)[0]}<br>${text}${start.split(text)[1]}`;
        item.value = newtext;
      }
    }
  });

  submit.addEventListener("click", () => {
    let newData = [];
    for (item of document.querySelectorAll(".dyk--item-text")) {
      newData.push(item.value);
    }
    socket.emit("updatefacts", newData);
  });
  for (item of document.querySelectorAll(".dyk--item-delete")) {
    item.addEventListener("click", async (item) => {
      console.log("click");

      let facts = item.srcElement;
      const id = facts.id.split("del")[1];
      facts.remove();
      console.log(document.getElementById(id).value);
      document.getElementById(id).remove();
      const factsHTML = document.querySelectorAll(".dyk--item-text");
      for (let fact of factsHTML) {
        fact.addEventListener("click", () => {
          factsPreview.innerHTML = fact.value;
          activeFact = fact;
        });
      }
    });
  }

  newfact.addEventListener("click", () => {
    factsPlaceholder.innerHTML += `<div class="dyk--item">
    <input id="${i}" value="" class="dyk--item-text"></>
    <div id="del${i}"  class="dyk--item-delete">
      <svg class="dyk--item--delete" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 579.13 579.13"><defs><style>.a{fill:#1d1d1b;}.a,.b{stroke:#1d1d1b;stroke-miterlimit:10;}.b{fill:#1d1d1b;}</style></defs><path class="a" d="M548.1,169.29C388.46,169.29,259,298.71,259,458.35S388.46,747.42,548.1,747.42,837.17,618,837.17,458.35,707.75,169.29,548.1,169.29Zm0,548.05c-143,0-259-116-259-259s116-259,259-259,259,116,259,259S691.14,717.34,548.1,717.34Z" transform="translate(-258.54 -168.79)"/><rect class="b" x="148.94" y="255.19" width="281.25" height="68.75"/></svg>
    </div>
  </div>`;
    i++;
    const factsHTML = document.querySelectorAll(".dyk--item-text");
    for (let fact of factsHTML) {
      fact.addEventListener("click", () => {
        factsPreview.innerHTML = fact.value;
        activeFact = fact;
      });
    }
    for (item of document.querySelectorAll(".dyk--item-delete")) {
      item.addEventListener("click", async (item) => {
        console.log("click");

        let facts = item.srcElement;
        const id = facts.id.split("del")[1];
        facts.remove();
        console.log(document.getElementById(id).value);
        document.getElementById(id).remove();
        const factsHTML = document.querySelectorAll(".dyk--item-text");
        factsPlaceholder.innerHTML = factsString;
        for (let fact of factsHTML) {
          fact.addEventListener("click", () => {
            factsPreview.innerHTML = fact.value;
            activeFact = fact;
          });
        }
      });
    }
  });

  const factsHTML = document.querySelectorAll(".dyk--item-text");
  for (let fact of factsHTML) {
    fact.addEventListener("click", () => {
      factsPreview.innerHTML = fact.value;
      activeFact = fact;
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
