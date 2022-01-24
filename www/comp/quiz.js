let questions = [];

const renderQuiz = async () => {
  const questionHTML = document.querySelector(".js-question");
  const timerHTML = document.querySelector(".js-time");

  const htmlContainerAnwsers = document.querySelector(".totaal--quiz-answers");

  if (!questions || !questionHTML || !timerHTML || !htmlContainerAnwsers) {
    return;
  }

  const question = questions[Math.round(Math.random() * (questions.length - 1))];
  const answers = question.answers;
  const correctAnswer = question.correct;
  questionHTML.innerHTML = question.question;

  let html = "";

  let pos = answers.length == 3 ? ["left", "middle", "right"] : ["left", "right"];

  for (let i in answers) {
    html += `<div class="js-answers-${pos[i]} totaal--item totaal--quiz-answer-${pos[i]} totaal--quiz-answer-container">
      <p class="totaal--quiz-answer">${answers[i]}</p>
    </div>`;
  }
  htmlContainerAnwsers.innerHTML = html;

  for (let i = 0; i < slideLength - 2; i++) {
    const timeLeft = slideLength - 2 - i;
    timerHTML.textContent = timeLeft;
    await delay(1000);
  }

  timerHTML.textContent = "Time's up!";
  htmlContainerAnwsers.innerHTML = `<div class="js-answers-all totaal--item totaal--quiz-answer-all totaal--quiz-answer-container totaal--quiz-answer-correct">
      <p class="totaal--quiz-answer">${correctAnswer}</p>
    </div>`;
};
