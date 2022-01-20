let questions = [];

const renderQuiz = async () => {
  const questionHTML = document.querySelector(".js-question");
  const timerHTML = document.querySelector(".js-time");

  if (!questions || !questionHTML || !timerHTML) {
    return;
  }

  const question = questions[Math.round(Math.random() * (questions.length - 1))];
  const answers = question.answers;
  const correctAnswer = question.correct;
  questionHTML.innerHTML = question.question;

  for (let i = 0; i < slideLength - 2; i++) {
    const timeLeft = slideLength - 2 - i;
    timerHTML.textContent = timeLeft;
    await delay(1000);
  }

  timerHTML.textContent = "Time's up!";
};
