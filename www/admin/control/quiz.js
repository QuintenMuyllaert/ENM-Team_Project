pageFunction["./control/quiz.html"] = async () => {
  console.log("Loaded quiz page.");
  const question = await fetch("../data/questions.json");
  const question_text = await question.json();
  const questions = document.querySelector(".quiz--questions-container");

  let new_html = `<p class="quiz--title">Quizvragen:</p>`;

  for (item of question_text) {
    console.log(item.question);
    new_html += `<div class="quiz--question-item">
    <p class="quiz--question-text">${item.question}</p>
    <svg class="quiz--question-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z" />
    </svg>
  </div>`;
  }
  questions.innerHTML = new_html;
  const detail = document.querySelectorAll(".quiz--question-item");
  for (quest of detail) {
    quest.addEventListener("click", async (item) => {
      const facts = item.srcElement;
      const question = await fetch("../data/questions.json");
      const question_text = await question.json();
      for (item of question_text) {
        if (item.question == facts.innerText) {
          document.querySelector(".quiz--answer-input").value = item.question;
          let idnum = 1;

          for (aswer of item.answers) {
            if (aswer == item.correct) {
              document.getElementById(`radio${idnum}`).checked = true;
            }
            document.getElementById(`Antwoord${idnum}`).value = aswer;
            idnum++;
          }
          if (idnum == 3) {
            document.getElementById(`Antwoord${idnum}`).value = "";
          }
        }
      }
    });
  }
};
