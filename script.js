window.onload = init

function init() {
    game = {};
    var words = getWords();
    game.guessWord = words[getRandomInt(0, words.length)].toUpperCase();
    game.errorsCount = 0;
    game.successCount = 0;
    game.needSuccessCount = game.guessWord.length;
    game.maxErrorCount = game.needSuccessCount * 2;

    game.cheat = false;
    document.getElementById('cheatButton').onclick = isCheatButtonClick;
    cheatOff();

    document.getElementById('gameResult').innerHTML = '';
    document.getElementById('timeToRestart').innerHTML = '';
    
    updateStatistic();

    createGuessWordLetters(game.guessWord.length);
    createLetterButtons();

    var letterButtonsDiv = document.getElementById('letter-buttons');
    letterButtonsDiv.onclick = onButtonClick;    
}

function isCheatButtonClick() {
    if(game.cheat)
        cheatOff();
    else
        cheatOn();
}

function cheatOn() {
    game.cheat = true;

    var button = document.getElementById('cheatButton');
    button.classList.remove('off');
    button.classList.add('on');

    var letterButtonsDiv = document.getElementById('letter-buttons');
    letterButtonsDiv.onmouseover = onButtonMouseOver;
    letterButtonsDiv.onmouseout = onButtonMouseOut;
}

function cheatOff() {
    game.cheat = false;

    var button = document.getElementById('cheatButton');
    button.classList.remove('on');
    button.classList.add('off');

    var letterButtonsDiv = document.getElementById('letter-buttons');
    letterButtonsDiv.onmouseover = null;
    letterButtonsDiv.onmouseout = null;
}

function onButtonClick(e) {
    if(!checkButtonAvaliable(e.target))
        return;

    clearButtonTipClass(e.target);
    e.target.disabled = true;

    var currentLetter = e.target.innerHTML;

    if(checkLetter(currentLetter)) {
        showLetterInGuessWord(currentLetter);
        e.target.classList.add('tip-right');
    }
    else {
        game.errorsCount++;
        e.target.classList.add('tip-wrong');
    }

    updateStatistic();
    tryFinishGame();
}

function onButtonMouseOver(e) {
    if(!checkButtonAvaliable(e.target))
        return;

    var currentLetter = e.target.innerHTML;

    if(checkLetter(currentLetter)) {
        e.target.classList.add('tip-right');
    }
    else {
        e.target.classList.add('tip-wrong');
    }
}

function onButtonMouseOut(e) {
    if(!checkButtonAvaliable(e.target))
        return;

    clearButtonTipClass(e.target);
}

function clearButtonTipClass(button) {
    button.classList.remove('tip-right');
    button.classList.remove('tip-wrong');
}

function checkButtonAvaliable(button) {
    if(!(button instanceof HTMLButtonElement))
        return false;

    if(button.disabled)
        return false;

    return true;
}

function createGuessWordLetters(guessWordLength) {
    var guessWordDiv = document.getElementById('guess-word');
    guessWordDiv.innerHTML = '';

    for(var i = 0; i < guessWordLength; i++) {
        var newLetter = document.createElement('div');
        newLetter.className = 'letter';
        guessWordDiv.appendChild(newLetter);
    }
}

function createLetterButtons() {
    var russianAlphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';

    var letterButtonsDiv = document.getElementById('letter-buttons');
    letterButtonsDiv.innerHTML = '';

    for(var i = 0; i < russianAlphabet.length; i++) {
        var newLetterButton = document.createElement('button');
        newLetterButton.className = 'letter-button';
        newLetterButton.innerHTML = russianAlphabet[i];
        letterButtonsDiv.appendChild(newLetterButton);
    }
}

function checkLetter(letter) {
    if(game.guessWord.indexOf(letter) < 0)
        return false;

    return true;
}

function showLetterInGuessWord(letter) {
    var guessWordDiv = document.getElementById('guess-word');

    for(var i=0; i < game.guessWord.length; i++) {
        if(game.guessWord[i] === letter) {
            guessWordDiv.children[i].innerHTML = letter.toUpperCase();
            game.successCount++;
        }
    }
}

function tryFinishGame() {
    if(game.successCount === game.needSuccessCount) {
        document.getElementById('gameResult').innerHTML = 'Вы победили!';
        document.getElementById('gameResult').style.color = 'green';
        disableAllButtons();
        timer(init, updateTimer, 5);
    }

    if(game.errorsCount >= game.maxErrorCount) {
        document.getElementById('gameResult').innerHTML = 'Вы проиграли!';
        document.getElementById('gameResult').style.color = 'red';
        disableAllButtons();
        timer(init, updateTimer, 5);  
    }
}

function disableAllButtons() {
    var buttons = document.getElementById('letter-buttons').children;

    for(var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }
}

function updateStatistic() {
    document.getElementById('letterCountInWord').innerHTML = game.guessWord.length;
    document.getElementById('successCount').innerHTML = game.successCount;
    document.getElementById('errorCount').innerHTML = game.errorsCount;
    document.getElementById('maxErrorCount').innerHTML = game.maxErrorCount;
}

function updateTimer(time) {
    document.getElementById('timeToRestart').innerHTML = 'Игра будет перезапущена через ' + time + ' секунд';
}

function timer(action, control, time) {
    timerTime = time;
    intervalID = setInterval(timerAction, 1000, action, control);
}

function timerAction(action, control) {
    control(timerTime);
    timerTime--;

    if(timerTime < 0) {
        clearInterval(intervalID);
        action();
    }
}

function getWords() {
    return ['Машина', 'Катафалк', 'Сено', 'Альпака', 'Баня', 'Ватман', 'Лизоблюд', 'Архив', 'Ересь']
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}