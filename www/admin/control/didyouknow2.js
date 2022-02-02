pageFunction["./control/didyouknow2.html"] = async () => {
  console.log("Loaded quiz page.");
  let questions = await fetchTxt("../data/facts.csv");
  let selected = -1;
  setInterval(() => {
    if (!document.querySelector(".quiz--questions-list")) {
      return;
    }
    let q = [];
    let qHtml = document.querySelector(".quiz--questions-list").querySelectorAll("textarea");
    let compiled = [];
    for (let i in qHtml) {
      const e = qHtml[i];
      q.push(e.value);
      let j = 0;
      let comp;
      if (e.value) {
        comp = e.value.replace(/\n/g, "<br>").replace(/\*\*/g, (e) => {
          j++;
          if (j % 2 == 1) {
            return "<span>";
          } else {
            return "</span>";
          }
        });
        compiled.push(comp);
        if (selected == i) {
          document.querySelector(".weetje").innerHTML = comp;
        }
      }
    }
    questions = q;
  }, 100);

  const render = async () => {
    document.querySelector(".admin--page-container").innerHTML = await fetchString("./control/didyouknow2.html");

    const quizQuestionHtml = `<div class="press--sidebyside"><textarea></textarea>
          <svg class="dyk--item-delete" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 579.13 579.13"><defs><style>.a{fill:#1d1d1b;}.a,.b{stroke:#1d1d1b;stroke-miterlimit:10;}.b{fill:#1d1d1b;}</style></defs><path class="a" d="M548.1,169.29C388.46,169.29,259,298.71,259,458.35S388.46,747.42,548.1,747.42,837.17,618,837.17,458.35,707.75,169.29,548.1,169.29Zm0,548.05c-143,0-259-116-259-259s116-259,259-259,259,116,259,259S691.14,717.34,548.1,717.34Z" transform="translate(-258.54 -168.79)"/><rect class="b" x="148.94" y="255.19" width="281.25" height="68.75"/></svg>
        </div>
        `;

    let HTMLquestions = document.querySelectorAll(".quiz--question-item");
    for (const h of HTMLquestions) {
      h.outerHTML = "";
    }
    document.querySelector(".quiz--questions-list").innerHTML = "";

    for (const question of questions) {
      if (question != "" && question != undefined) {
        document.querySelector(".quiz--questions-list").innerHTML += quizQuestionHtml;
      }
    }
    let qHtml = document.querySelector(".quiz--questions-list").querySelectorAll("textarea");
    for (let i = 0; i < qHtml.length; i++) {
      qHtml[i].value = questions[i]
        .replace(/\n/g, "")
        .replace(/\<span\>/g, "**")
        .replace(/\<\/span\>/g, "**")
        .replace(/\<br\/\>/g, "\n")
        .replace(/\<br\>/g, "\n");

      qHtml[i].addEventListener("click", async () => {
        selected = i;
      });
    }

    HTMLquestions = document.querySelectorAll(".quiz--question-item");
    for (let i = 0; i < HTMLquestions.length; i++) {
      const h = HTMLquestions[i];
      h.addEventListener("click", async () => {
        selected = i;
        document.querySelector(".quiz--answer-input").value = questions[i].question;
        for (let j = 0; j < 3; j++) {
          document.querySelector(`#Antwoord${j}`).value = questions[i].answers[j] || "";
        }
        let correct = questions[i].answers.indexOf(questions[i].correct);
        document.querySelector(`#radio${correct}`).click();
      });
    }

    document.querySelector(".dyk--item-add-svg").addEventListener("click", async () => {
      questions.unshift("Sample fact");
      selected = 0;
      render();
    });

    document.querySelectorAll(".dyk--item-delete").forEach((e) => {
      e.addEventListener("click", async () => {
        e.parentNode.outerHTML = "";
      });
    });

    document.querySelector(".js-send").addEventListener("click", async () => {
      let q = [];
      let eles = document.querySelectorAll("textarea");
      for (let i = 0; i < eles.length; i++) {
        let j = 0;
        q.push(
          eles[i].value.replace(/\n/g, "<br>").replace(/\*\*/g, (e) => {
            j++;
            if (j % 2 == 1) {
              return "<span>";
            } else {
              return "</span>";
            }
          })
        );
      }
      socket.emit("updatefacts", q);
      questions = await fetchTxt("../data/facts.csv");
      render();
    });
  };
  questions = await fetchTxt("../data/facts.csv");
  render();
};
