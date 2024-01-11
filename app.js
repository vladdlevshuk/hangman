document.addEventListener("DOMContentLoaded", function () {
  const attemptsCounterDiv = document.createElement("div");
  attemptsCounterDiv.id = "attempts-counter";
  document.body.appendChild(attemptsCounterDiv);

  const attemptsImagesPath = "./src/img/";
  let currentAttemptImage = 1;

  const gallowsImage = document.createElement("img");
  gallowsImage.id = "gallows";
  gallowsImage.src = `${attemptsImagesPath}${currentAttemptImage}.png`;
  document.body.appendChild(gallowsImage);

  const questionDiv = document.createElement("div");
  questionDiv.id = "question";
  document.body.appendChild(questionDiv);

  const wordDisplayDiv = document.createElement("div");
  wordDisplayDiv.id = "word-display";
  document.body.appendChild(wordDisplayDiv);

  const keyboardDiv = document.createElement("div");
  keyboardDiv.id = "keyboard";
  document.body.appendChild(keyboardDiv);

  const messageModalDiv = document.createElement("div");
  messageModalDiv.id = "message-modal";
  messageModalDiv.style.display = "none";
  document.body.appendChild(messageModalDiv);

  const footer = document.createElement("footer");

  const githubLink = document.createElement("a");
  githubLink.href = "https://github.com/vladdlevshuk";

  const githubIcon = document.createElement("img");
  githubIcon.src = "src/img/github.png";
  githubIcon.alt = "Github Icon";
  githubIcon.width = 35;
  githubIcon.height = 35;

  githubLink.appendChild(githubIcon);
  footer.appendChild(githubLink);

  const yearSpan = document.createElement("span");
  yearSpan.textContent = "© 2023";
  footer.appendChild(yearSpan);

  const courseLink = document.createElement("a");
  courseLink.href = "https://rs.school/js/";

  const courseIcon = document.createElement("img");
  courseIcon.src = "src/img/rsschool.svg";
  courseIcon.alt = "Courses Icon";
  courseIcon.width = 70;
  courseIcon.height = 35;

  courseLink.appendChild(courseIcon);
  footer.appendChild(courseLink);

  document.body.appendChild(footer);

  const overlay = document.createElement("div");
  overlay.id = "overlay";
  document.body.appendChild(overlay);

  function showOverlay() {
    overlay.style.display = "block";
  }

  function hideOverlay() {
    overlay.style.display = "none";
  }

  let questions = [
    "Unit of electric current measurement",
    "Longest river in the world",
    "Continent washed by four oceans",
    "Fourth planet from the Sun",
    "Surname of the author of 'Eugene Onegin'",
    "This is a predatory fish that lives in fresh water",
    "This is the name of the largest planet in the solar system",
    "This is the name of the smallest bird",
    "The name of the largest animal in the world",
    "The name of the tallest grass"
  ];
  let answers = ["Ampere", "Amazon", "Eurasia", "Mars", "Pushkin", "Pike", "Jupiter", "Hummingbird", "Blue Whale", "Bamboo"];

  let currentQuestionIndex;
  let secretWord;
  let incorrectGuesses;
  let guessedLetters;
  let playedQuestions = [];

  function startGame() {
    hideOverlay();
    if (playedQuestions.length === questions.length) {
      playedQuestions = [];
    }

    do {
      currentQuestionIndex = Math.floor(Math.random() * questions.length);
    } while (playedQuestions.includes(currentQuestionIndex));

    playedQuestions.push(currentQuestionIndex);

    secretWord = answers[currentQuestionIndex].toLowerCase();
    incorrectGuesses = 0;
    guessedLetters = new Set();

    updateUI();
  }

  function guessLetter(letter) {
    if (!guessedLetters.has(letter)) {
      guessedLetters.add(letter);

      if (secretWord.includes(letter)) {
        if (checkGameStatus()) {
          endGame("Congratulations! You guessed the word!");
        }
        } else {
          incorrectGuesses++;
          currentAttemptImage++;
          if (incorrectGuesses === 6) {
            endGame("You lost. Try again.");
          }
        }
      updateUI();
    }
  }

  function checkGameStatus() {
    return secretWord.split("").every((letter) => guessedLetters.has(letter));
  }

  function updateUI() {
    gallowsImage.src = `${attemptsImagesPath}${currentAttemptImage}.png`;
    questionDiv.textContent = `${questions[currentQuestionIndex]}`;
    wordDisplayDiv.textContent = `${getDisplayedWord()}`;

    keyboardDiv.innerHTML = "";
    for (let letter of "abcdefghijklmnopqrstuvwxyz") {
      const button = document.createElement("button");
      button.textContent = letter;
      button.onclick = function () {
        guessLetter(letter);
        button.disabled = true;
      };
      if (guessedLetters.has(letter)) {
        button.disabled = true;
        button.classList.add("guessed");
      }
      keyboardDiv.appendChild(button);
    }

    attemptsCounterDiv.textContent = `Attempts: ${incorrectGuesses}/6`;
  }

  function getDisplayedWord() {
    return secretWord
    .split("")
    .map((letter) => (guessedLetters.has(letter) ? letter : "_"))
    .join(" ");
  }

  function endGame(message) {
    showOverlay();

    const modalMessage = document.createElement("p");
    modalMessage.textContent = message;

    const modalWord = document.createElement("p");
    modalWord.textContent = `Secret word: ${secretWord}`;

    const playAgainButton = document.createElement("button");
    playAgainButton.textContent = "Play again";
    playAgainButton.onclick = restartGame;

    messageModalDiv.innerHTML = "";
    messageModalDiv.appendChild(modalMessage);
    messageModalDiv.appendChild(modalWord);
    messageModalDiv.appendChild(playAgainButton);

    messageModalDiv.style.display = "flex";
  }

  function restartGame() {
    messageModalDiv.style.display = "none";
    currentAttemptImage = 1;
    startGame();
  }

  startGame();

  document.addEventListener("keydown", function (event) {
    const pressedKey = event.key.toLowerCase();
    if (/^[a-z]$/i.test(pressedKey) && !guessedLetters.has(pressedKey)) {
      guessLetter(pressedKey);
      const buttons = keyboardDiv.getElementsByTagName("button");
      for (let button of buttons) {
        if (button.textContent.toLowerCase() === pressedKey) {
          button.classList.add("guessed");
          button.disabled = true;
          break;
        }
      }
    }
  });
});
