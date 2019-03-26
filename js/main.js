// Global
const playerDatalist = document.getElementById('playersList');
const wordDatalist = document.getElementById('wordsList');
const wrongGuessesUl = document.getElementById('wrongGuesses');
const guessedWordsUl = document.getElementById('guessedWords');
const playerNameSpan = document.getElementById('playerName');
const modal = document.getElementById('myModal');
const modalBody = document.getElementById('modal-body');
const span = document.getElementsByClassName("close")[0];
const letsAndNums = /^[0-9a-zA-Z]+$/;
let cPlayer = '';
let playerName = document.getElementById('playerListInput').value;
let guesses = 5;
let startingWord = '';
let time = 0;
let seconds = 0;
let interval = 0;
let score = 0;
let totalScore = 0;
let totalTime = 0;

// Arrays
const playerArray = [];
const wordsArray = [];
const helperWordArray = [];
let joinGuessingWord = [];
let LsPlayerArray = JSON.parse(localStorage.getItem('insertPlayerToLS')) || [];

// Main parts
const startField = document.getElementById('startFieldSet');
const gameField = document.getElementById('gameFieldSet');

// Buttons
const addPlayerButton = document.getElementById('addPlayerBtn');
const addWordButton = document.getElementById('addWordBtn');
const deletePlayerButton = document.getElementById('deletePlayerBtn');
const deleteWordButton = document.getElementById('deleteWordBtn');
const startGameButton = document.getElementById('startGameBtn');
const checkLetterButton = document.getElementById('guessLetterBtn');
const restartButton = document.getElementById('restartGame');
const hightScoreButton = document.getElementById('hightScoreBtn');
const clearStorageButton = document.getElementById('clearStorageBtn');

// Inputs
const playerInput = document.getElementById('playerInput');
const wordInput = document.getElementById('wordInput');

// Events
startGameButton.addEventListener("click", startGame);
addPlayerButton.addEventListener('click', addPlayer);
addWordButton.addEventListener('click', addWord);
deletePlayerButton.addEventListener('click', deletePlayer);
deleteWordButton.addEventListener('click', deleteWord);
checkLetterButton.addEventListener('click', checkLetter);
restartButton.addEventListener('click', restartGame);
clearStorageBtn.addEventListener('click', clearStorage);
// When the user clicks the button, open the modal 
hightScoreButton.onclick = function() {
    modal.style.display = "block";
};
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
};
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};
window.onload = function() {
    displayPlayers();
};

// Functions
function startGame() {
    const selectedPlayer = document.getElementById('playerListInput').value;
    const selectedWord = document.getElementById('wordListInput').value;
    startingWord = selectedWord.toLowerCase();
    cPlayer = selectedPlayer;
    if(playerArray.indexOf(selectedPlayer) === -1 || wordsArray.indexOf(selectedWord) === -1) {
        alert('Couldn\'t find player or game word name.');
    }else {
        startField.classList.add("zoomOut");
        gameField.classList.add("slideInRight");
        gameField.style.display = 'block';

        for (var i = 0; i < startingWord.length; i++) {
            joinGuessingWord[i] = '_';
        }

        let getPlayerName = LsPlayerArray.find( element => {
            return element.name === cPlayer;
        })

        if(getPlayerName) {
            console.log('Postojeci igrac ' + getPlayerName);
        }else {
            LsPlayerArray.push({ 'name': cPlayer, 'game': [] });
            localStorage.setItem('insertPlayerToLS', JSON.stringify(LsPlayerArray));
            console.log('Dodajem igraca');
        }
    }
    playerNameSpan.textContent = selectedPlayer;
    document.getElementById('guessingWord').textContent = joinGuessingWord.join(' ');
    document.getElementById('livesSpan').textContent = guesses;
    interval = setInterval(timer, 1000);
}

function addPlayer() {
    const currentPlayer = document.getElementById('playerInput').value;
    if(currentPlayer.match(letsAndNums)) {
        playerArray.push(currentPlayer);
        const newPlayer = document.createElement('option');
        newPlayer.value = currentPlayer;
        playerDatalist.appendChild(newPlayer);
        document.getElementById('playerInput').value = '';
    }else {
        alert('Name must not be empty and can contain only letters and numbers!');
    }
}

function addWord() {
    const currentWord = document.getElementById('wordInput').value;
    if(wordsArray.includes(currentWord)) {
        alert('U must not enter same word.');
    }else if(currentWord.match(letsAndNums)) {
        wordsArray.push(currentWord);
        const newWord = document.createElement('option');
        newWord.value = currentWord;
        wordDatalist.appendChild(newWord);
        document.getElementById('wordInput').value = '';
    }else {
        alert('Word must not be empty and can contain only letters and numbers!');
    }
}

function deletePlayer() {
    const currentPlayer = document.getElementById('playerListInput').value;
    const playerPosition = playerArray.indexOf(currentPlayer);

    if(playerArray.length <= 0) {
        console.log('Empty player array.');
    }else if(playerArray.indexOf(currentPlayer) > -1) {
        playerArray.splice(playerPosition, 1);
        playerDatalist.removeChild(playerDatalist.childNodes[playerPosition]);
    }
    document.getElementById('playerListInput').value = '';
}

function deleteWord() {
    const currentWord = document.getElementById('wordListInput').value;
    const wordPosition = wordsArray.indexOf(currentWord);

    if(wordsArray.length <= 0) {
        console.log('Empty word array.');
    }else if(wordsArray.indexOf(currentWord) > -1) {
        wordsArray.splice(wordPosition, 1);
        wordDatalist.removeChild(wordDatalist.childNodes[wordPosition]);
    }
    document.getElementById('wordListInput').value = '';
}

function checkLetter() {
    const letterInput = document.getElementById('enterLetterInput').value;
    const newLetter = document.createElement('li');
    const saveWord = document.createElement('li');
    if(letterInput) {
        if(startingWord.indexOf(letterInput) == -1) {
            guesses--;
            newLetter.textContent = letterInput;
            wrongGuessesUl.appendChild(newLetter);
            if(score === 0) {
                score = 0;
            }else {
                score -= 0.25;
            }
        }else {
            for(let i = 0; i < startingWord.length; i++) {
                if(startingWord[i] === letterInput) {
                    joinGuessingWord[i] = letterInput;
                    score += 0.50;
                }
            }
        }
        document.getElementById('enterLetterInput').value = '';
        document.getElementById('guessingWord').textContent = joinGuessingWord.join(' ');
    }
    if(guesses === 0) {
        alert('You lost all lives!');
        document.getElementById('enterLetterInput').disabled = 'disabled';
        checkLetterButton.disabled = true;
        clearInterval(interval);

    }
    if(startingWord === joinGuessingWord.join('')) {
        newLetter.textContent = joinGuessingWord.join('');
        helperWordArray.push({ 'word': joinGuessingWord.join(''), 'time': seconds, 'points': score });
        totalScore += score;
        totalTime += seconds;
        seconds = 0;
        score = 0;
        const getWord = helperWordArray.find(function(word) {
            return word.word == newLetter.textContent;
        })
        saveWord.textContent = ' word: ' + getWord.word + ' - ( time: ' + getWord.time + ', points: ' + getWord.points + ' )';
        guessedWordsUl.appendChild(saveWord);
        joinWords = [];
        continueGame();
    }
    document.getElementById('livesSpan').textContent = guesses;
    document.getElementById('score').textContent = score;
}

function restartGame() {
    location.reload();
}

function continueGame() {
    newWord = wordsArray[Math.floor(Math.random() * wordsArray.length)];
    if(wordsArray.length > helperWordArray.length) {
        if(helperWordArray.some(e => e.word === newWord)) {
            continueGame();
        }else {
            startingWord = newWord;
            console.log(startingWord);
            console.log(joinGuessingWord);
            joinGuessingWord = [];
            for(let i = 0; i < startingWord.length; i++) {
                joinGuessingWord[i] = '_';
            }
        }
    }else {
        document.getElementById('enterLetterInput').disabled = 'disabled';
        checkLetterButton.disabled = true;
        clearInterval(interval);
        alert("Congratulation! You won!");

        for(let i = 0; i < LsPlayerArray.length; i++) {
            if(LsPlayerArray[i].name === cPlayer) {
                console.log('nasli igraca' + LsPlayerArray[i].name);
                LsPlayerArray[i].game.push({ 'totalScore': totalScore, 'totalTime': totalTime });
                localStorage.setItem('insertPlayerToLS', JSON.stringify(LsPlayerArray));
            }
        }
    }
    document.getElementById('guessingWord').textContent = joinGuessingWord.join(' ');
}

function timer() {
    document.getElementById('time').textContent = seconds;
    seconds++;
};

function displayPlayers() {
    let output = '';
    let myPara = document.createElement('p');
    if(LsPlayerArray.length === 0) {
        output += 'Scoreboard is empty.';
        myPara.textContent = output;
        modalBody.appendChild(myPara);
    }else {
        for(let i = 0; i < LsPlayerArray.length; i++) {
            let myDiv = document.createElement('div');
            let myPara = document.createElement('p');
            let myOl = document.createElement('ol');
    
            myPara.textContent = 'Player: ' + LsPlayerArray[i].name;
    
            let tst = LsPlayerArray[i].game;

            for(let j = 0; j < tst.length; j++) {
                let listItem = document.createElement('li');
                listItem.textContent = ' - Total score: ' + tst[j].totalScore + ', Total time: ' + tst[j].totalTime;
                myOl.appendChild(listItem)
            }
    
            myDiv.appendChild(myPara);
            myDiv.appendChild(myOl);
            modalBody.appendChild(myDiv);
        }
    }
}

function clearStorage() {
    localStorage.clear();
    restartGame();
}