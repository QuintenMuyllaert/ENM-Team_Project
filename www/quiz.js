let JsonObject, countdown;

const loadJson = (callback) => {
  var jsonBestand = new XMLHttpRequest();
  jsonBestand.overrideMimeType("application/json"); //geef het type mee dat je wilt lezen
  jsonBestand.open("GET", "./questions.json", true); //open de json fjle
  jsonBestand.onreadystatechange = function () {
    if (jsonBestand.readyState == 4 && jsonBestand.status == "200") {
      callback(jsonBestand.responseText); //ga naar de functie "readJson"
    }
  };
  jsonBestand.send(null); //indien het jsonbestand niet bestaat stuur "null"
};

const readJson = (jsonData) => {
  const Json = JSON.parse(jsonData);
  JsonObject = Json;
};

const quiz = () => {
  loadJson(readJson);
  const questionHTML = document.querySelector(".js-question");
  const timerHTML = document.querySelector(".js-time");
  let timeLeft = slideLength-1;
  timerHTML.innerHTML = timeLeft;
  if (JsonObject) {
    const numberOfQuestions = JsonObject.questions.length;
    const questionIndex = Math.floor(Math.random() * numberOfQuestions);
    let question = JsonObject.questions[questionIndex].question;
    let answers = JsonObject.questions[questionIndex].answers;
    let correctAnswer = JsonObject.questions[questionIndex].correct;
    questionHTML.innerHTML = `${question}`;
  }
  var now = new Date();
  countdown = new Date();
  countdown.setSeconds(now.getSeconds() + (slideLength-1));
  var x = setInterval(function(){
      now = new Date().getTime();
      var distance = countDown - now;
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      timerHTML.innerHTML = seconds + "s";
      if (distance < 0){
          clearInterval(x);
          timerHTML.innerHTML = "tijd is op";
      }
  }, 1000);
};
