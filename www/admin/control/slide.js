pageFunction["./control/slide.html"] = async () => {
  console.log("en zo link je functions die moeten starten als je setting inload");

  if (lookupList(tree["slide"], ".html")[pageNrToEdit] == undefined) {
    console.log("out of bounds");
    if (pageNrToEdit < 0) {
      pageNrToEdit = lookupList(tree["slide"], ".html").length - 1;
    } else {
      pageNrToEdit = 0;
    }
  }
  const fileName = "../slide/" + lookupList(tree["slide"], ".html")[pageNrToEdit];

  skeletonSlide = await fetchString("../skeletonSlide.html");
  document.querySelector(".press--slide-viewport").innerHTML = generateSlide(await fetchString(fileName)).replace(/\.\//g, "../");
  const height = document.querySelector(".press--slide-container").offsetHeight;

  const scalefactor = height / 3260;
  document.querySelector(".press--slide-scale").style.transform = `scale(${scalefactor},${scalefactor})`;

  const htmlSlide = document.querySelector(".press--slide-scale").querySelector(".slide--root");
  const textTags = ["P", "H1", "H2", "H3", "H4", "H5", "A", "SPAN", "BUTTON"];

  let selected = null;
  setInterval(() => {
    if (!selected) {
      return;
    }
    if (!textTags.includes(selected.tagName)) {
      return;
    }
    if (selected.getAttribute("dataElement") != null) {
      return;
    }
    selected.innerHTML = document.querySelector(".press-selected-item").value;
  }, 50);
};
