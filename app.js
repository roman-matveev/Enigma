document.addEventListener('DOMContentLoaded', () => {
    const wordCount = 10;
    var guessCount = 4;
    var password = '';

    var start = document.getElementById('start');
    start.addEventListener('click', () => {
        toggleClasses(document.getElementById('start-screen'), 'hide', 'show');
        toggleClasses(document.getElementById('game-screen'), 'hide', 'show');
        startGame();
    });

    function toggleClasses(element, ...classNames) {
        classNames.forEach(name => element.classList.toggle(name));
    }

    function startGame() {
        var wordList = document.getElementById("word-list");
        var randomWords = getRandomValues(words);

        for (let word of randomWords) {
            var li = document.createElement("li");
            li.innerText = word;
            wordList.appendChild(li);
        };

        [password] = getRandomValues(randomWords, 1);
        setGuessCount(guessCount);

        wordList.addEventListener('click', updateGame);
    }

    let getRandomValues = (array, numberOfVals=wordCount) => shuffle(array).slice(0, numberOfVals);

    function shuffle(array) {
        var arrayCopy = array.slice();
        for (let idx1 = arrayCopy.length - 1; idx1 > 0; idx1--) {
            var idx2 = Math.floor(Math.random() * (idx1 + 1));
            [arrayCopy[idx1], arrayCopy[idx2]] = [arrayCopy[idx2], arrayCopy[idx1]]
        } return arrayCopy;
    }

    function setGuessCount(newCount) {
        guessCount = newCount;
        document.getElementById("guesses-remaining").innerText = `Guesses remaining: ${guessCount}.`;
    }

    function updateGame({target}) {
        if (target.tagName === "LI" && !target.classList.contains("disabled")) {
            var guess = target.innerText;
            var similarityScore = compareWords(guess, password);

            target.classList.add("disabled");
            target.innerText = `${target.innerText} has ${similarityScore} matching letters.`;
            setGuessCount(guessCount - 1);

            if (similarityScore === password.length) {
                toggleClasses(document.getElementById("winner"), 'hide', 'show');
                this.removeEventListener('click', updateGame);
            } else if (guessCount === 0) {
                toggleClasses(document.getElementById("loser"), 'hide', 'show');
                this.removeEventListener('click', updateGame);
            }
        }
    }

    function compareWords(word1, word2) {
        if (word1.length !== word2.length) throw "Words must have the same length.";

        var count = 0;
        for (let i = 0; i < word1.length; i++) {
            if (word1[i] === word2[i]) count++;
        } return count;
    }
});
