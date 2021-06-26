// DOM elements
const playBtn = document.getElementsByClassName("play")[0],
    input = document.getElementsByTagName("input")[0],
    wordCntr = document.getElementById("random-word"),
    statsCntr = document.getElementById("stats"),
    timeCntr = document.getElementById('time'),
    scoreCntr = document.getElementById('score'),
    showInstBtn = document.getElementById("show-instructions");

// global stats
let array = ['help', 'dolphin', 'horse', 'soul', "success", "foreface", "fangle", "fadeout", "begod", "shakes", "unary", "toxifera", "wonders", "alarm", "igigi", "Fujisan", "latitude", "yield", "wild", "dissolve", "Apple", "vampire", "winter", "decides", "delete", "society", "length", "abuse", "pacifist", "bride", "handle", "dragon", "playgirl", "unique", "blades", "aldehyde", "structure", "found", "leech", "rope", "letter", "canoe", "vessels", "abort", "patent", "metallic", "stands", "spell", "tangent", "toranto", "unwind", "supernet", "spoken", "Youth", "choice", "enter", "parallel", "demand", "forest", "provoke", "temple", "ratio", "abstract", "carbon", "action", "honest", "meadow", "wear", "mosquito", "full", "cheap", "defeat", "enlarge", "slide", "outer", "robot", "possible", "training", "falsify", "bitch", "soprano", "comment", "colon", "plug", "bolt", "leader", "division", "elect", "taxi", "banner", "module", "seal", "warm", "dynamic", "weed", "cash", "stroke", "list", "screen", "memory", "flag", "patent", "route", "assume", "mistreat", "kinship", "round", "ankle", "flower", "realize", "facility", "rear", "property", "mine", "jacket", "even", "trade", "forestry", "register", "waist", "move", "fever", "brave", "cheese", "football", "embox", "nest", "swing", "exclude", "chief", "sector", "debate", "behavior", "defend", "fair", "bend", "battle", "rough", "friendly", "narrow", "dynamic", "shed", "trunk", "shaft", "spend", "club", "literacy"];

let wordsArray = [...array];
let randomWord = '',
    time = 10,
    score = -1,
    difficulty = 1,
    intervalID = 0;

// TODO    
// 1. fetch random words from wordnik api, forming an array getArray()
// wordsArray=await getArray();

// initialiing speech utterance
let speech = new SpeechSynthesisUtterance();

const setVoice = () => {
    let voices = speechSynthesis.getVoices();
    // speech.pitch = 2;
    // speech.rate = 0.8;
    speech.voice = voices[4];
}

// utter the word
const sayWord = (string) => {
    speech.text = string;
    speechSynthesis.speak(speech);
}

// remove the play button
const removeBtn = () => playBtn.classList.add("none");

// input gets the focus
const focusOnInput = () => input.focus();

// displays the required data in the specified element in HTML
const displayInHTML = (elem, data) => elem.innerHTML = data;

// restarts the game
const restart = () => {

    // reset the stats
    wordsArray = [...array];
    time = 10;
    score = -1;
    difficulty = 1;

    // remove the game over container
    const gameOverCntr = document.getElementById("game-over");
    gameOverCntr.classList.add("none");

    // add the main container
    const gameCntr = document.getElementById("game-container");
    gameCntr.classList.remove("none");

    clearInputField();
    displayWord();
    focusOnInput();
    startTimer();
    updateScoreAndDiff()
}

// when the game is over
const gameOver = () => {

    // remove the main container
    const gameCntr = document.getElementById("game-container");
    gameCntr.classList.add("none");

    // show the high score and reload button
    const gameOverCntr = document.getElementById("game-over");
    gameOverCntr.innerHTML = `Your score is ${score}. <button type="button" id="reload">Play Again</button>`;
    gameOverCntr.classList.remove("none");

    // giving the message to user through speech
    sayWord("game over");

    // adding a click listener to the reload button
    const reloadBtn = document.getElementById("reload");
    reloadBtn.addEventListener("click", restart);
}

// checks if the timer goes 0
const checkTime = () => {
    if (time == 0) {
        clearInterval(intervalID);
        gameOver()
    }
}

// updates the time as commanded
const updateTime = (sec) => {
    time += sec;
    displayInHTML(timeCntr, `Time: ${time}s`);

    // seconds adding animation
    if (sec > 0) {
        let span = statsCntr.lastElementChild;
        span.innerText = '+' + sec;
        setTimeout(() => {
            span.classList.remove("span");
        }, 1000);
        span.classList.add("span");
    }
}

// starts the timer
const startTimer = () => {

    // displaying timer in HTML
    displayInHTML(timeCntr, `Time: ${time}s`);
    intervalID = setInterval(() => {

        // time is decreasing
        updateTime(-1);
        checkTime();
    }, 1000);
}

// get a random word from the wordsArray
const getRandomWord = () => {
    let index = Math.floor(Math.random() * wordsArray.length),
        word = wordsArray[index].toLowerCase();
    wordsArray.splice(index, 1);
    return word;
}

// displays a random word in HTML
const displayWord = () => {
    randomWord = getRandomWord();
    displayInHTML(wordCntr, randomWord);
    sayWord(randomWord);
}

// increases the difficulty level
const increaseDifficulty = (score) => {
    if (score % 3 == 0) ++difficulty;
}

// shows the score in HTML
const updateScoreAndDiff = () => {
    ++score;
    let str = `Score: ${score}`;
    if (score > 0) str += '<span class="span">+1</span>';
    displayInHTML(scoreCntr, str);
    increaseDifficulty(score);
}

// start the game
const startTheGame = () => {
    setVoice();
    removeBtn();
    focusOnInput();
    displayWord();
    startTimer();
    updateScoreAndDiff()
}

// clears the input field
const clearInputField = () => input.value = '';

// increases the time according to difficlty
const incTimeAccToDiff = () => {
    let increaseBy = 0;
    switch (difficulty) {
        case 1:
            increaseBy = 5;
            break;
        case 2:
            increaseBy = 4;
            break;
        case 3:
            increaseBy = 3;
            break;
        case 4:
            increaseBy = 2;
            break;
        default:
            increaseBy = 1;
    }
    updateTime(increaseBy)
}

// checks the string in the input for the random word
const checkInput = (event) => {
    const input = event.target.value.toLowerCase();
    if (input == randomWord) {
        setTimeout(clearInputField, 100);

        // shows a new word
        displayWord();
        updateScoreAndDiff();
        incTimeAccToDiff()
    }
}

// EVENT listeners
playBtn.addEventListener("click", startTheGame);
input.addEventListener("input", checkInput);

// shows the instructions
const showInstructions = () => {
    const inst = document.querySelector(".instructions");
    inst.classList.remove("none");
    setTimeout(() => inst.classList.add("show"), 1);

    // event listener to remove instructions
    const closeBtn = document.getElementById("close-instructions");
    closeBtn.addEventListener("click", () => {
        inst.classList.remove("show");
        setTimeout(() => inst.classList.add("none"), 800);
    });
}

// EVENT listener for instructions
showInstBtn.addEventListener("click", showInstructions);