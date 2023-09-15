(function () {
  const letters = document.querySelectorAll(".letter");
  const waitContainer = document.querySelector(".wait-container");
  const header = document.querySelector(".header");
  const answerLength = 5;
  const guesses = 6;

  function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
  }

  function displayAnswer(number, row, guess, letter) {
    letters[number * row + guess.length - 1].innerText = letter;
  }

  function setLoading(isLoading) {
    waitContainer.classList.toggle("hidden", !isLoading);
  }

  function addLetter(guess, letter) {
    if (guess.length < answerLength) {
      guess += letter;
    } else {
      // replace last letter with new letter
      guess = guess.substring(0, guess.length - 1) + letter;
    }
    return guess;
  }

  async function init() {
    let currentGuess = "";
    let currentRow = 0;
    let isLoading = true;
    let gameOver = false;

    // Fetch random word then remove loading symbol
    const res = await fetch("https://words.dev-apis.com/word-of-the-day?random=1");
    const { word: wordRes } = await res.json();
    const word = wordRes.toUpperCase();
    const wordArray = word.split("");

    if (wordArray.length > 0) {
      isLoading = false;
      setLoading(isLoading);
    } else {
      alert("Uh oh! The word API isn't working!")
    }

    document.addEventListener('keydown', handleKeyPress);

    function handleKeyPress(event) {
      if (gameOver || isLoading) {
        return;
      }
      const key = event.key;

      if (key === 'Enter') {
        submitAnswer(currentGuess, answerLength);
      } else if (key === 'Backspace') {
        currentGuess = handleBackspace(answerLength, currentRow, currentGuess);
      } else if (isLetter(key)) {
        currentGuess = addLetter(currentGuess, key.toUpperCase());
        displayAnswer(answerLength, currentRow, currentGuess, key);
      } else {
        alert("Not a valid input");
      }
    }

    async function submitAnswer(guess, answer) {
      if (guess.length !== answer) {
        alert("Must enter 5 letters");
        return;
      }

      isLoading = true;
      setLoading(isLoading);

      const res = await fetch("https://words.dev-apis.com/validate-word", {
        method: "POST",
        body: JSON.stringify({ word: currentGuess })
      });

      const resObj = await res.json();
      const { validWord } = resObj;

      isLoading = false;
      setLoading(isLoading);

      if (!validWord) {
        handleInvalidGuess();
        return;
      }

      handleCorrectGuess(guess, wordArray);
      currentRow++;

      if (currentGuess === word) {
        handleGameWin();
      } else if (currentRow === guesses) {
        handleGameOver();
      }

      currentGuess = "";
    }

    function handleBackspace(number, row, guess) {
      guess = guess.substring(0, guess.length - 1);
      letters[number * row + guess.length].innerText = "";
      return guess;
    }

    function handleInvalidGuess() {
      for (let i = 0; i < answerLength; i++) {
        letters[currentRow * answerLength + i].classList.add("invalid");

        setTimeout(function () {
          letters[currentRow * answerLength + i].classList.remove("invalid");
        }, 3000);
      }
    }

    function handleCorrectGuess(guess, wordArray) {
      const guessArray = guess.split("");
      const map = createLetterMap(wordArray);

      for (let i = 0; i < answerLength; i++) {
        if (guessArray[i] === wordArray[i]) {
          letters[currentRow * answerLength + i].classList.add("correct");
          map[guessArray[i]]--;
        }
      }

      for (let i = 0; i < answerLength; i++) {
        if (guessArray[i] === wordArray[i]) {
          // do nothing
        } else if (map[guessArray[i]] && map[guessArray[i]] > 0) {
          letters[currentRow * answerLength + i].classList.add("close");
          map[guessArray[i]]--;
        } else {
          letters[currentRow * answerLength + i].classList.add("wrong");
        }
      }
    }

    function handleGameWin() {
      header.innerText = "Winner!";
      header.classList.add("win");
      gameOver = true;
    }

    function handleGameOver() {
      alert("You've run out of guesses. Try again!");
      gameOver = true;
    }

    function createLetterMap(array) {
      const obj = {};
      for (let i = 0; i < array.length; i++) {
        const letter = array[i];
        if (obj[letter]) {
          obj[letter]++;
        } else {
          obj[letter] = 1;
        }
      }
      return obj;
    }
  }
  init();
})();
