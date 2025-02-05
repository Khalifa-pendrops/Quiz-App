const questionContainer = document.getElementById("question_container");
const questionText = document.getElementById("question");
const answerButtons = document.getElementById("answer_buttons");
const nextButton = document.getElementById("next_btn");
const resultContainer = document.getElementById("result_container");
const resultText = document.getElementById("result_text");
const progress = document.getElementById("progress");
const restartButton = document.getElementById("restart_btn");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedButton = null;

const quizQuestions = async () => {
  questionText.innerHTML = "<h3>Loading questions... please wait.</h3>";
  //   answerButtons.innerHTML = "";
  //   nextButton.classList.add("hide");

  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=5&category=18&type=multiple"
    );
    const data = await response.json();
    questions = data.results.map((question) => ({
      question: question.question,
      correctAnswer: question.correct_answer,
      answers: shuffle([
        ...question.incorrect_answers.map((answer) => ({
          text: answer,
          correct: false,
        })),
        { text: question.correct_answer, correct: true },
      ]),
    }));
    questionContainer.classList.remove("hide");
    startQuiz();
  } catch (error) {
    console.error("Error fetching questions:", error);
    questionContainer.innerHTML =
      "<h3>Error fetching questions. Please try again later.</h3>";
  }
};

const shuffle = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const startQuiz = () => {
  currentQuestionIndex = 0;
  score = 0;
  resultContainer.classList.add("hide");
  questionContainer.classList.remove("hide");
  nextButton.classList.add("hide");
  fetchQuestion();
};

const fetchQuestion = () => {
  resetState();
  const currentQuestion = questions[currentQuestionIndex];
  questionText.innerHTML = currentQuestion.question;
  progress.innerText = `${currentQuestionIndex + 1} / ${questions.length}`;

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    button.addEventListener("click", () =>
      selectAnswer(button, answer.correct)
    );
    answerButtons.appendChild(button);
  });
};

const resetState = () => {
  nextButton.classList.add("hide");
  answerButtons.innerHTML = "";
  if (selectedButton) {
    selectedButton.classList.add("clicked");
  }
  selectedButton = null;
};

const selectAnswer = (button, isCorrect) => {
  if (selectedButton && selectedButton !== button) {
    selectedButton.classList.remove("clicked");
  }
  selectedButton = button;

  button.classList.add("clicked");

  Array.from(answerButtons.children).forEach((btn) => (btn.disabled = true));

  nextButton.classList.remove("hide");

  if (isCorrect) {
    score++;
    button.classList.add("correct");
  } else {
    button.classList.add("wrong");
  }
};

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    fetchQuestion();
  } else {
    getResult();
  }
});

const getResult = () => {
  questionContainer.classList.add("hide");
  resultContainer.classList.remove("hide");
  //   resultText.innerText = `Your final score is ${score} / ${questions.length}`;
  setTimeout(() => {
    alert(`Your final score is ${score} / ${questions.length}`);
  }, 5000);
};

restartButton.addEventListener("click", () => {
  resultContainer.classList.add("hide");
  quizQuestions();
});

quizQuestions();
