// ***** JavaScript Code *****

// Declare Global variables
var tableNumber = 99;
var score = 0;
var attempts = 0;
var state = true;
var firstNum = 89;
var time = 60;
var gameRunning = true;
var quit = false;
var isTimedGame = false;
var timer;
var timer2;
var animTimer;
var num = 0;
var isRandomTables = false;
var previousRandomNumber = 0;

// DOM Elements
const gameHeader = document.querySelector("#gameHeader");
const timerDisplay = document.querySelector("#timerDisplay");
const scoreDisplay = document.querySelector("#score");
const userTries = document.querySelector("#attempts");
const submitBtn = document.querySelector("#btn");
const userAnswerTextBox = document.querySelector("#userAnswerTextBox");
const freeFlowBtn = document.querySelector("#freeFlowBtn");
const timedTestBtn = document.querySelector("#timedTestBtn");
const startButton = document.querySelector("#startBtn");
const defaultGame = document.querySelector("#defaultTest");
const numSelect = document.querySelector("#numSelect");
const numberChoiceScreen = document.querySelector("#chooseNumber");
const backToMenuBtn = document.querySelectorAll(".backToMenuBtn");
const resultMessage = document.querySelector("#result");

// created elements
const percent = document.createElement("h1");
percent.style.fontSize = "350%";
percent.classList = "my-3";

// *************************************************
// ************  Event Listeners  ******************
// *************************************************

var modals = document.getElementsByClassName("backToMenuBtn");
for (var i = 0; i < modals.length; i++) {
  modals[i].addEventListener("click", function() {
    location.reload();
  });
}

userAnswerTextBox.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    submitBtn.click();
  }
});

submitBtn.addEventListener("click", function(event) {
  event.preventDefault();
  calcAnswer();
});

freeFlowBtn.addEventListener("click", function() {
  let menu = document.getElementById("mainMenu");
  menu.style.display = "none";
  numberChoiceScreen.style.display = "block";
});

timedTestBtn.addEventListener("click", function() {
  let menu = document.getElementById("mainMenu");
  menu.style.display = "none";
  numberChoiceScreen.style.display = "block";
  isTimedGame = true;
  timerDisplay.innerHTML = "Remaining Time:";
});

startButton.addEventListener("click", function() {
  if (numSelect.value === "All") {
    isRandomTables = true;
  }
  tableNumber = numSelect.value;
  numberChoiceScreen.style.display = "none";
  defaultGame.style.display = "block";
  showSum();
  resetUserInputBox();
  // check if timed game was selected
  if (isTimedGame) timeLimitTest();
});

// *************************************************
// **************** FUNCTIONS **********************
// *************************************************

function calcAnswer() {
  var userAnswer = userAnswerTextBox.value;

  console.log(userAnswer);

  if (userAnswer !== "") {
    var convertedUserAnswer = parseInt(userAnswer);

    if (convertedUserAnswer == firstNum * tableNumber) {
      resultMessage.innerHTML = "Correct - Well Done";
      resultMessage.style.backgroundColor = "green";
      score++;
      attempts++;
      resetUserInputBox();
      showSum();
    } else {
      // display message to user, clear textbox and give it focus
      resultMessage.innerHTML = "That's Wrong - Try Again";
      resultMessage.style.backgroundColor = "red";
      attempts++;
      resetUserInputBox();
    }

    // Show score in user interface
    scoreDisplay.innerHTML = score;
    userTries.innerHTML = attempts;
  }
}

function showSum() {
  // generate a random number between 1 and 12
  let randomNumber = generateRandomNumber(12, 1);

  if (randomNumber == previousRandomNumber) {
    while (randomNumber == previousRandomNumber) {
      randomNumber = generateRandomNumber(12, 1);
      console.log("RM: " + randomNumber);
    }
    document.getElementById("sum1").innerHTML = randomNumber;
    previousRandomNumber = randomNumber;
  } else {
    document.getElementById("sum1").innerHTML = randomNumber;
    previousRandomNumber = randomNumber;
    //console.log("PRN: " + previousRandomNumber);
  }

  if (isRandomTables) {
    // generate a random number between 3 and 12
    let randomNumber2 = generateRandomNumber(11, 2);
    // assign random number between 3 and 12 to element
    document.getElementById("sum2").innerHTML = randomNumber2;

    // asign the random gen times table to the tableNumber variable
    tableNumber = randomNumber2;

    console.log("Rand2 = " + randomNumber2);
  } else {
    // assign users chosen times table number to element
    document.getElementById("sum2").innerHTML = tableNumber;
  }

  // and assign it to the firstNum variable
  firstNum = randomNumber;
}

function generateRandomNumber(num1, num2) {
  return Math.floor(Math.random() * num1) + num2;
}

function timeLimitTest() {
  timer = setInterval(countdown, 1000);
  gameHeader.innerHTML = "60 second<br>Tables Test";

  timer2 = setInterval(checkGameStatus, 50);
}

//  game timer countdown
function countdown() {
  if (time > 0) {
    time--;
  } else {
    gameRunning = false;
    //endOfTest();
    clearInterval(timer);
  }
  // show countdown in UI
  document.getElementById(
    "timerDisplay"
  ).innerHTML = `Remaining Time : <span class="remaining-time">${time}</span>`;
}

// CLEARS INPUT BOX AND GIVES IT FOCUS
function resetUserInputBox() {
  document.getElementById("userAnswerTextBox").focus();
  document.getElementById("userAnswerTextBox").value = "";
}

// check if time has run out - show the results
function checkGameStatus() {
  if (!gameRunning && time === 0) {
    showResults();
    clearInterval(timer2);
  }
}

function showResults() {
  // Hide the game screen
  defaultGame.style.display = "none";

  // create new elements
  const header = document.createElement("h2");
  header.textContent = "Test Results";
  header.className = "mb-3";
  header.style.fontFamily = "Permanent Marker";

  const amount = document.createElement("h5");
  amount.textContent = "You Answered " + attempts + " Questions in 60 seconds";

  const correct = document.createElement("h4");
  correct.textContent = "Correct Answers: " + score;

  const wrong = document.createElement("h4");
  // get qty of wrong answers
  const incorrectAnswers = attempts - score;
  // display wrong answer qty in IU
  wrong.textContent = "Wrong Answers: " + incorrectAnswers;

  let testPercent = (score / attempts) * 100;
  let percentToTwoDecimalPlaces = testPercent.toFixed("1");

  // run the animated percentage score
  testPercentAnimation(percentToTwoDecimalPlaces);

  const menuButton = document.createElement("button");
  menuButton.classList = "btn btn-dark btn-block backToMenuBtn mt-3";
  menuButton.textContent = "Back To Menu";

  // add new elements to container
  const appContainer = document.querySelector("#container");
  appContainer.appendChild(header);
  appContainer.appendChild(amount);
  appContainer.appendChild(correct);
  appContainer.appendChild(wrong);
  appContainer.appendChild(percent);
  appContainer.appendChild(menuButton);

  // added again as back to menu button nor working after timer finished
  var modals = document.getElementsByClassName("backToMenuBtn");
  for (var i = 0; i < modals.length; i++) {
    modals[i].addEventListener("click", function() {
      location.reload();
    });
  }
}

function testPercentAnimation(userPercent) {
  // start timer - increment every 15th second
  animTimer = setInterval(function() {
    // add 1 to num and display until num equals test percentage
    if (num < userPercent) {
      num++;
      percent.textContent = num + "%";
    } else {
      clearInterval(animTimer);
    }
  }, 15);
}
