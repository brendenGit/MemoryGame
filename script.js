//selectors
const gameBox = document.getElementById("gameBox");
const startGameBox = document.getElementById("startGameBox");
const scoreBox = document.querySelector('#scoreBox');

//create our lowest score element
const lowestScore = document.createElement('h3');

if (localStorage.getItem('lowest score') === null) {
  localStorage.setItem('lowest score', 0);
  lowestScore.innerText = `Your lowest score is: ${localStorage.getItem('lowest score')}`;
} else {
  lowestScore.innerText = `Your lowest score is: ${localStorage.getItem('lowest score')}`;
}

//array of colors we will use
const availableColors = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
];


let numberOfCards = 0;
function handleInput(e) {
  numberOfCards = e.target.value;
}


//array for board (cards)
let cardsArray = []


//create our card amount input and label
const cardAmountInput = document.createElement('input');
cardAmountInput.setAttribute('id', 'cardAmountInput');
const cardAmountLabel = document.createElement('label');
cardAmountLabel.innerText = 'Enter an even number: ';
cardAmountLabel.setAttribute('for', 'cardAmountInput');
cardAmountInput.addEventListener('input', handleInput);



//create our restart button
const restartButton = document.createElement('button');
restartButton.innerHTML = 'Restart Game?';
restartButton.addEventListener('click', restartGame)
restartButton.classList.add('hidden');

//create our startGame button
const startGameBtn = document.createElement('button');
startGameBtn.innerText = 'Start Game';
startGameBtn.setAttribute('id', 'startGameBtn');

//create H1 to show score
let score = document.createElement('h1');


//Start game and add score once button is clicked
startGameBtn.addEventListener('click', startGame);


//startGame runs when startGameBtn is clicked
//called by restartGame
function startGame() {

  if (numberOfCards % 2 != 0 || numberOfCards == 0) {
    alert("Enter an even number!");
    return;
  }

  //when we start the game we need to create our "deck" of cards
  for (let i = 0; i <= availableColors.length; i) {
    if (i === availableColors.length) {
      i = 0;
    } else if (cardsArray.length == numberOfCards) {
      break;
    } else {
      cardsArray.push(availableColors[i]);
      cardsArray.push(availableColors[i]);
      i++;
    }
  }

  // here is a helper function to shuffle an array
  // it returns the same array with values shuffled
  // it is based on an algorithm called Fisher Yates
  function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }
    return array;
  }


  //gets us a new randomly shuffled array
  let shuffledColors = shuffle(cardsArray);
  console.log(shuffledColors);


  // this function loops over the array of colors
  // it creates a new div and gives it a class with the value of the color
  // it also adds an event listener for a click for each card
  function createDivsForColors(colorArray) {
    for (let color of colorArray) {
      // create a new div
      const newDiv = document.createElement("div");

      // give it a class attribute for the value we are looping over
      newDiv.classList.add(color, "cardDiv");

      // call a function handleCardClick when a div is clicked on
      newDiv.addEventListener("click", handleCardClick);

      // append the div to the element with an id of game
      gameBox.append(newDiv);
    }
  }

  //find max possible score for that game
  maxScore = cardsArray.length / 2;

  //set value of scoreCount to 0
  score.innerText = `Current Score: ${scoreCount}`;

  //hide startGame button after we press it
  startGameBtn.classList.add('hidden');

  //if we've already played a game score will be hidden
  //once we start the game unhide it to show score
  if (score.classList.contains('hidden')) {
    score.classList.remove('hidden');
    //if this is our first game append the score element to the scoreBox
  } else {
    scoreBox.insertBefore(score, scoreBox.firstChild);
  };

  //creates our game board
  createDivsForColors(cardsArray);

  cardAmountInput.classList.add('hidden');
  cardAmountLabel.classList.add('hidden');
}


//clears the gameboard and resets our score to 0 
function clearGameBoard() {

  //hide score as we wait for a new game to start
  score.classList.add('hidden');

  //remove all of the divs (cards) in the gameBox
  gameBox.innerHTML = '';

  //reset score count
  scoreCount = 0;

  //update score elements innerText to 0 for new game
  score.innerText = `Current Score: ${scoreCount}`;
}


//restarts the game by "un-hidding" our startGameBtn and clearing the rest of the board
function restartGame() {
  startGameBtn.classList.remove('hidden');
  restartButton.classList.add('hidden');
  cardAmountInput.classList.remove('hidden');
  cardAmountLabel.classList.remove('hidden');
  clearGameBoard();
}



//cardCount to gatekeep and only allow 2 cards to clicked at a time (a counter'ish)
let cardCount = 1;
//array to store value of clicked element - values used to check if there is a match
const compareCardValue = [];
//array to store the DOM element that was clicked
const divsClicked = [];
//previousCard is updated only on the first click of the set of 2 cards to help check for duplicates
let previousCard;
//score count variable
let scoreCount = 0;


//click handler to perform operations to check for match
function handleCardClick(e) {
  //if this is our first click
  if (cardCount === 1) {

    //"turn over card"
    e.target.classList.add('clicked');

    //update arrays with first card value and DOM element
    updateArrays(e);

    //set previous card value (1st card value)
    previousCard = e.target;

    //add one to card count to prepare for our second click
    cardCount += 1;

    //if this is our second click
  } else if (cardCount === 2) {

    //"turn over card"
    e.target.classList.add('clicked');

    //update arrays with second card value and DOM element
    updateArrays(e);

    //check if we have a match by calling checkMatch and assigning boolean value to match
    let match = checkMatch(e);

    //if we have a match (match === true) remove event listener to avoid further clicks
    if (match) {
      for (let i = 0; i < divsClicked.length; i++)
        divsClicked[i].removeEventListener("click", handleCardClick);

      //reset all of our arrays and card count to prepare for next guess
      reset();

      //else we do not have a match (match === false)
    } else {

      //add one to cardCount to set it to 3 immediately and avoid setTimeout
      cardCount += 1;

      //after 2 seconds turn the cards back over
      setTimeout(function () {
        for (let i = 0; i < divsClicked.length; i++)
          divsClicked[i].classList.remove('clicked');
        reset();
      }, 2000);
    }
  }
}


//updateArrays will add our 2 clicked cards values and respective elements
//to the arrays to store, compare, and update them
function updateArrays(e) {
  compareCardValue.push(e.target.classList[0]);
  divsClicked.push(e.target);
}


//reset will reset our arrays holding our values and divs clicked
//clearing them with the .length method
//reset will also reset our card counter to 1
function reset() {
  divsClicked.length = 0;
  compareCardValue.length = 0;
  cardCount = 1
}


//checkMatch will return a true or false value. True if there is a match
//or false if it is a duplicate click or not a match
function checkMatch(e) {

  //returns false if we have a duplicate
  if (checkDuplicate(e, previousCard)) {
    return false;

    //returns true if we have a match
  } else if (compareCardValue[0] === compareCardValue[1]) {

    //updates score count by 1
    //updates localStorage lowest score
    scoreCount += 1;
    if (scoreCount > parseInt(localStorage.getItem('lowest score'))) {
      localStorage.setItem('lowest score', scoreCount);
      lowestScore.innerText = `Your lowest score is: ${localStorage.getItem('lowest score')}`;
    }

    //updates score element
    score.innerText = `Current Score: ${scoreCount}`;

    //checks if we've won the game from that match
    if (gameWon()) {
      restartButton.classList.remove('hidden');
    }
    return true;
  } else {

    //if we dont have a match return false
    return false;
  }
}


//checks for win condition (hit max score)
function gameWon() {
  if (scoreCount === maxScore) {
    return true;
  }
}


//checkDuplicate will check to see if the 2nd click was the same as the first click
function checkDuplicate(e, previousCard) {
  return e.target === previousCard
}


// When DOM loads we want a start game button to appear and we append our restartButton
//restart button by default will be hidden until max score is reached
document.addEventListener('DOMContentLoaded', function () {
  startGameBox.appendChild(cardAmountLabel);
  startGameBox.appendChild(cardAmountInput);
  startGameBox.appendChild(startGameBtn);
  scoreBox.appendChild(restartButton);
  scoreBox.appendChild(lowestScore);
});
