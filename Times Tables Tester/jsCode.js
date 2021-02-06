// ***** JavaScript Code *****

// Declare Global variables
let tableNumber = 99;
let score = 0;
let attempts = 0;
let state = true;
let firstNum = 89;
let time = 180;
let gameRunning = true;
let quit = false;
let isTimedGame = false;
let timer;
let timer2;
let animTimer;
let num = 0;
let isRandomTables = false;
let previousRandomNumber = 0;
let db = null;

// DOM Elements
const gameHeader = document.querySelector("#gameHeader");
const showSavedResults = document.querySelector("#showSavedResults");
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
const resultTextArea = document.querySelector("#textAreaResults");
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

showSavedResults.addEventListener("click", function() {
  if (resultTextArea.style.display === "block") {
    resultTextArea.style.display = "none";
  } else {
    resultTextArea.style.display = "block";
  }
  get_record();
});

// *************************************************
// **************** PROGRAM START ******************
// *************************************************
createDB();

// *************************************************
// **************** FUNCTIONS **********************
// *************************************************

function createDB() {
  let request = indexedDB.open("TimesTableDB");
  request.onerror = function(event) {
    console.log("Problem opening database");
  };

  request.onupgradeneeded = function(event) {
    db = event.target.result;
    let scoreObjectStore = db.createObjectStore("gameResults", {
      keyPath: "datetime"
    });
    scoreObjectStore.transaction.oncomplete = function(event) {
      console.log("scoreObjectStore Created");
    };
  };

  request.onsuccess = function(event) {
    db = event.target.result;
    console.log("DB Opened");
    //insert_records(score);
    db.onerror = function(event) {
      console.log("Failed to open db");
    };
  };
}

// **********************************************************************************************************

function insert_records(records) {
  if (db) {
    const insert_transaction = db.transaction("gameResults", "readwrite");
    const scoreObjectStore = insert_transaction.objectStore("gameResults");
    insert_transaction.oncomplete = function() {
      console.log("ALL INSERT TRANSACTIONS COMPLETE.");
    };
    insert_transaction.onerror = function() {
      console.log("PROBLEM INSERTING RECORDS.");
    };
    for (const gameScore of records) {
      let request = scoreObjectStore.add(gameScore);
      request.onsuccess = function() {
        console.log("Added: ", gameScore);
      };
    }
  }
}

//****************************************************************************************

function get_record() {
  if (db) {
    const get_transaction = db.transaction("gameResults", "readonly");
    const objectStore = get_transaction.objectStore("gameResults");
    get_transaction.oncomplete = function() {
      console.log("ALL GET TRANSACTIONS COMPLETE.");
    };
    get_transaction.onerror = function() {
      console.log("PROBLEM GETTING RECORDS.");
    };

    let request = objectStore.getAll();
    request.onsuccess = function(event) {
      // Call function which displays results in textarea
      displayResults(event.target.result);
    };
  }
}

// ***************************************************************************************

function displayResults(results) {
  resultTextArea.innerHTML = "";
  results.forEach(function(item) {
    let oldResult = resultTextArea.innerHTML;
    resultTextArea.innerHTML =
      oldResult +
      JSON.stringify(item.datetime) +
      " : " +
      JSON.stringify(item.answered) +
      " : " +
      JSON.stringify(item.correct) +
      " : " +
      JSON.stringify(item.wrong) +
      " : " +
      JSON.stringify(item.percent) +
      " : " +
      JSON.stringify(item.table) +
      "\n";
  });
}

// ***************************************************************************************

function calcAnswer() {
  var userAnswer = userAnswerTextBox.value;

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

// ***************************************************************************************

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

// ***************************************************************************************

function generateRandomNumber(num1, num2) {
  return Math.floor(Math.random() * num1) + num2;
}

// ***************************************************************************************

function timeLimitTest() {
  timer = setInterval(countdown, 1000);
  gameHeader.innerHTML = "3 Minute<br>Tables Test";
  progressBar();
  timer2 = setInterval(checkGameStatus, 50);
}

// ***************************************************************************************

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
  document.getElementById("timerDisplay").innerHTML =
    "Remaining Time: " + time + " seconds";
}

// ***************************************************************************************

function progressBar() {
  let timedProgressBar = document.getElementById("timedProgressBar");
  timedProgressBar.style.display = "block";
  let colouredBar = document.getElementById("colouredBar");
  let width = 1;
  let id = setInterval(frame, 1800);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
      //i = 0;
    } else {
      width++;
      colouredBar.style.width = width + "%";
      if (width >= 50) {
        colouredBar.style.backgroundColor = "orange";
      }
      if (width >= 80) {
        colouredBar.style.backgroundColor = "red";
      }
    }
  }
}

// ***************************************************************************************

// CLEARS INPUT BOX AND GIVES IT FOCUS
function resetUserInputBox() {
  document.getElementById("userAnswerTextBox").focus();
  document.getElementById("userAnswerTextBox").value = "";
}

// ***************************************************************************************

function checkGameStatus() {
  if (!gameRunning && time === 0) {
    showResults();
    clearInterval(timer2);
  }
}

// ***************************************************************************************

function showResults() {
  // Hide the game screen
  defaultGame.style.display = "none";

  // create new elements
  const header = document.createElement("h2");
  header.textContent = "Test Results";
  header.className = "mb-3";
  header.style.fontFamily = "Permanent Marker";

  const amount = document.createElement("h5");
  amount.textContent = "You Answered a total of " + attempts + " sums";

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

  /************************************************************************
   ************************************************************************** */

  // create date and time stamp and format for easy reading - e.g 17-Jan-2021:22.14
  const d = new Date();
  const ye = new Intl.DateTimeFormat("en-GB", { year: "numeric" }).format(d);
  const mo = new Intl.DateTimeFormat("en-GB", { month: "short" }).format(d);
  const da = new Intl.DateTimeFormat("en-GB", { day: "2-digit" }).format(d);
  const hr = new Intl.DateTimeFormat("en-GB", { hour: "numeric" }).format(d);
  const min = new Intl.DateTimeFormat("en-GB", { minute: "numeric" }).format(d);
  const resultDateTime = `${da}-${mo}-${ye}:${hr}:${min}`;

  // create an object containing results
  const gameResultsForLocalStorage = [
    {
      datetime: resultDateTime,
      answered: attempts,
      correct: score,
      wrong: incorrectAnswers,
      percent: percentToTwoDecimalPlaces,
      table: numSelect.value
    }
  ];

  // save game results data to local storage
  insert_records(gameResultsForLocalStorage);

  /************************************************************************
   ************************************************************************** */

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

// ***************************************************************************************

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
