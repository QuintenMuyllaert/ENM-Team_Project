let folder = "slide";
let order = [];
let slideLength = 0;
const showPrompt = async () => {
  await delay(500);
  document.querySelector(".press--prompt").classList.remove("prompt-down");
  await delay(2000);
  document.querySelector(".press--prompt").classList.add("prompt-down");
};

setInterval(() => {
  const len = document.querySelector("#slidelength");
  if (!len) {
    return;
  }

  if (Number(slidelength) != Number(len.value)) {
    if (Number(len.value) == 0) {
      return;
    }
    slidelength = Number(len.value);
    socket.emit("config", { slideLength: Number(slidelength) });
  }
}, 100);

pageFunction["./control/press.html"] = async () => {
  tree = await fetchJSON("../tree.json");
  let slideInCorrectFormat = {};
  let order = await fetchJSON("../slideorder.json");
  for (const o of order) {
    slideInCorrectFormat[o] = 1;
  }

  tree["slide"] = slideInCorrectFormat;

  if (lookupList(tree[folder], ".html")[pageNrToEdit] == undefined) {
    console.log("out of bounds");
    if (pageNrToEdit < 0) {
      pageNrToEdit = lookupList(tree[folder], ".html").length - 1;
    } else {
      pageNrToEdit = 0;
    }
  }
  let fileName = "../" + folder + "/" + lookupList(tree[folder], ".html")[pageNrToEdit];

  document.querySelector("#slidelength").value = Number((await fetchJSON("../config.json")).slideLength);

  document.querySelector(".press--addslide").textContent = folder == "template" ? "-" : "+";
  document.querySelector(".press--addslide").addEventListener("click", async function () {
    if (folder != "template") {
      folder = "template";
      this.textContent = "-";
      pageNrToEdit = 0;
      document.querySelector(".admin--page-container").innerHTML = await fetchString("./control/press.html");
      await pageFunction["./control/press.html"]();
    } else {
      folder = "slide";
      this.textContent = "+";
      pageNrToEdit = 0;
      document.querySelector(".admin--page-container").innerHTML = await fetchString("./control/press.html");
      await pageFunction["./control/press.html"]();
    }
  });

  document.querySelector(".press--number").textContent = pageNrToEdit;
  document.querySelector(".press--newpagenr").textContent = pageNrToEdit;

  skeletonSlide = await fetchString("../skeletonSlide.html");
  document.querySelector(".press--slide-viewport").innerHTML = generateSlide(await fetchString(fileName)).replace(/\.\//g, "../");
  const height = document.querySelector(".press--slide-container").offsetHeight;

  const scalefactor = height / 1080;
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

  setInterval(() => {
    if (!selected) {
      return;
    }

    if (document.querySelector("#toolbox--dataValue").value == "") {
      selected.removeAttribute("dataElement");
      selected.removeAttribute("dataValue");
      return;
    }
    selected.setAttribute("dataElement", null);
    selected.setAttribute("dataValue", document.querySelector("#toolbox--dataValue").value);
    if (document.querySelector("#toolbox--dataType").value) {
      selected.setAttribute("dataType", document.querySelector("#toolbox--dataType").value);
    } else {
      selected.removeAttribute("dataType");
    }
  }, 50);

  htmlSlide.addEventListener("click", (event) => {
    document.querySelector("#toolbox--dataType").value = "";
    document.querySelector("#toolbox--dataValue").value = "";
    document.querySelector("#toolbox--selected").value = "";

    document.querySelectorAll(".press--outline").forEach((e) => e.classList.remove("press--outline"));
    if (textTags.includes(event.target.tagName)) {
      document.querySelector(".press-selected-item").value = event.target.innerHTML;
      event.target.classList.add("press--outline");
      selected = event.target;
    } else {
      console.log("not text");
    }
    let dataElement = null;
    if (event.target.getAttribute("dataElement") != null) {
      console.log("Self is dataElement");
      dataElement = event.target;
    } else {
      let e = event.target.parentNode;
      while (e.getAttribute("dataElement") == null) {
        e = e.parentNode;
        if (e.tagName == "BODY") {
          console.log("No dataElement in tree.");
          break;
        }
      }
      if (e.getAttribute("dataElement") != null) {
        console.log("Parent is dataElement");
        dataElement = e;
      }
    }
    if (dataElement != null) {
      selected = dataElement;
      selected.classList.add("press--outline");

      document.querySelector("#toolbox--dataType").value = dataElement.getAttribute("dataType");
      document.querySelector("#toolbox--dataValue").value = dataElement.getAttribute("dataValue");
    } else {
      event.target.classList.add("press--outline");
      selected = event.target;
    }
  });

  const uploader = new SocketIOFileUpload(socket);
  uploader.listenOnInput(document.getElementById("siofu_input"));
  uploader.addEventListener("complete", (e) => {
    selected.src = "../upload/" + e.file.name;
  });

  document.querySelector(".press--undo").addEventListener("click", async () => {
    console.log("Undo-ing changes.");
    document.querySelector(".admin--page-container").innerHTML = await fetchString("./control/press.html");
    showPrompt();
    await pageFunction["./control/press.html"]();
  });

  document.querySelector(".press--goforward").addEventListener("click", async () => {
    pageNrToEdit++;
    document.querySelector(".admin--page-container").innerHTML = await fetchString("./control/press.html");
    await pageFunction["./control/press.html"]();
  });

  document.querySelector(".press--goback").addEventListener("click", async () => {
    pageNrToEdit--;
    document.querySelector(".admin--page-container").innerHTML = await fetchString("./control/press.html");
    await pageFunction["./control/press.html"]();
  });

  document.querySelector(".press--movepageright").addEventListener("click", async () => {
    order = swap(order, pageNrToEdit, pageNrToEdit + 1);
    pageNrToEdit++;
    socket.emit("order", order);

    document.querySelector(".admin--page-container").innerHTML = await fetchString("./control/press.html");
    await pageFunction["./control/press.html"]();
  });

  document.querySelector(".press--movepageleft").addEventListener("click", async () => {
    order = swap(order, pageNrToEdit, pageNrToEdit - 1);
    pageNrToEdit--;
    socket.emit("order", order);

    document.querySelector(".admin--page-container").innerHTML = await fetchString("./control/press.html");
    await pageFunction["./control/press.html"]();
  });

  document.querySelector(".press--save").addEventListener("click", async () => {
    console.log("Saving changes.");
    const htmlPage = document.querySelector(".press--slide-viewport").querySelector(".slide--root");

    htmlPage.querySelectorAll(".press--outline").forEach((e) => e.classList.remove("press--outline"));
    const newHtml = htmlPage.innerHTML.replace(/\.\.\//g, "./");

    if (folder == "template") {
      socket.emit("save", "generated-slide-" + Date.now().toString() + ".html", newHtml);
    } else {
      socket.emit("save", fileName.split("/").pop(), newHtml);
    }
    folder = "slide";
    pageNrToEdit = 0;
    document.querySelector(".admin--page-container").innerHTML = await fetchString("./control/press.html");
    showPrompt();
    await pageFunction["./control/press.html"]();
  });

  document.querySelector(".press--trash").addEventListener("click", async () => {
    console.log("Get rid of it");
    if (folder == "template") {
      console.log("No point as it not even saved yet.");
    } else {
      console.log("Boom its gone.");
      socket.emit("remove", fileName.split("/").pop());
    }
    pageNrToEdit = 0;
    document.querySelector(".admin--page-container").innerHTML = await fetchString("./control/press.html");
    showPrompt();
    await pageFunction["./control/press.html"]();
  });
};
