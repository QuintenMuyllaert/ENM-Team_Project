let questions = [];

const renderQuiz = async () => {
  const questionHTML = document.querySelector(".js-question");
  const timerHTML = document.querySelector(".js-time");

  const htmlContainerAnwsers = document.querySelector(".item--medium-quiz-answers-container");

  if (!questions || !questionHTML || !timerHTML || !htmlContainerAnwsers) {
    return;
  }

  const question = questions[Math.round(Math.random() * (questions.length - 1))];
  const answers = question.answers;
  const correctAnswer = question.correct;
  questionHTML.innerHTML = question.question;

  let html = "";

  let pos = answers.length == 3 ? ["left", "middle", "right"] : ["left-middle", "right-middle"];

  for (let i in answers) {
    html += `<div class="js-answers-${pos[i]} item--style item--medium-quiz-answers-${pos[i]} item--medium-quiz-answers-container-seperate">
      <p class="item--medium-quiz-answer-text">${answers[i]}</p>
    </div>`;
  }
  htmlContainerAnwsers.innerHTML = html;

  for (let i = 0; i < slideLength - 2; i++) {
    const timeLeft = slideLength - 2 - i;
    timerHTML.textContent = timeLeft;
    await delay(1000);
  }

  timerHTML.textContent = "Time's up!";
  htmlContainerAnwsers.innerHTML = `<div class="js-answers-all item--style item--medium-quiz-answers-correct item--medium-quiz-answers-container-seperate item--medium-quiz-answer-correct-style">
      <p class="item--medium-quiz-answer-text">${correctAnswer}</p>
    </div>`;
};
