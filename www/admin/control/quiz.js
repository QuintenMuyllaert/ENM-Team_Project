pageFunction["./control/quiz.html"] = async () => {
  console.log("Loaded quiz page.");
  let questions = await fetchJSON("../data/questions.json");
  const render = async () => {
    let selected = -1;
    let correct = -1;
    document.querySelector(".admin--page-container").innerHTML = await fetchString("./control/quiz.html");

    const quizQuestionHtml = `<div class="quiz--question-item">
        <p class="quiz--question-text">##replace##</p>
        <svg class="quiz--question-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z" />
        </svg>
      </div>`;

    let HTMLquestions = document.querySelectorAll(".quiz--question-item");
    for (const h of HTMLquestions) {
      h.outerHTML = "";
    }

    for (const question of questions) {
      document.querySelector(".quiz--questions-list").innerHTML += quizQuestionHtml.replace("##replace##", question.question);
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

    document.querySelector(".js-submit").addEventListener("click", async () => {
      if (selected >= 0) {
        questions[selected] = {
          question: document.querySelector(".quiz--answer-input").value,
          answers: [document.querySelector(`#Antwoord0`).value, document.querySelector(`#Antwoord1`).value, document.querySelector(`#Antwoord2`).value],
        };
        questions[selected].correct = questions[selected].answers[correct];

        if (questions[selected].answers[2] == "") {
          questions[selected].answers.pop();
        }
      }
      socket.emit("questions", questions);
      render();
    });

    document.querySelector(".js-delete").addEventListener("click", async () => {
      questions.splice(selected, 1);
      socket.emit("questions", questions);
      render();
    });

    for (let i = 0; i < 3; i++) {
      document.querySelector(`#radio${i}`).addEventListener("click", async function () {
        correct = i;
      });
    }

    document.querySelector(".dyk--item-add-svg").addEventListener("click", async () => {
      questions.push({
        question: "Sample question",
        answers: ["A", "B", "C"],
        correct: "A",
      });
      render();
    });
  };
  render();
};
