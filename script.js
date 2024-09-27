document.addEventListener('DOMContentLoaded', function() {
    // characters array is now globally available from characters.js
    let currentCharacter = "";
    let score = 0;

    setupInitialModalBehavior();
    initializeGame();  // Directly initialize the game

    function setupInitialModalBehavior() {
        const initialModal = document.getElementById("myModal");
        initialModal.style.display = "block";
        document.getElementById('resultModal').style.display = 'none';

        document.querySelector('.close').addEventListener('click', () => {
            initialModal.style.display = "none";
        });

        window.addEventListener('click', (event) => {
            if (event.target === initialModal) {
                initialModal.style.display = "none";
            }
        });
    }

    function initializeGame() {
        score = 0;
        setupEventListeners();
        selectNewCharacter();  // Start the game by selecting a new character
    }

    function setupEventListeners() {
        const giveUpButton = document.querySelector('button[name="giveUpButton"]');
        const guessButton = document.querySelector('button[name="guessButton"]');
        const namesButton = document.querySelector('button[name="namesButton"]');
        const playAgainButton = document.getElementById('playAgainButton');

        guessButton.addEventListener('click', handleGuess);
        giveUpButton.addEventListener('click', handleGiveUp);
        namesButton.addEventListener('click', handleNames);
        playAgainButton.addEventListener('click', handlePlayAgain);
    }

    function selectNewCharacter() {
        currentCharacter = characters[Math.floor(Math.random() * characters.length)];
        clearClues();
        document.getElementById('guessBox').value = '';
    }

    function handleGuess() {
        const guessBox = document.getElementById('guessBox');
        const userGuess = guessBox.value.trim().toLowerCase();
        const guessedCharacter = characters.find(char => char.name.toLowerCase() === userGuess);

        if (guessedCharacter) {
            markGuessedCharacter(guessedCharacter);
            const isCorrectGuess = guessedCharacter.name === currentCharacter.name;
            updateCluesBasedOnGuess(guessedCharacter, currentCharacter);
            if (isCorrectGuess) {
                showResultModal(`Correct! It was ${currentCharacter.name}.`);
            } else {
                animateIncorrectGuess();
            }
        } else {
            alert('Character not found, try again!');
        }

        score++;
        guessBox.value = ''; // Clear the guessBox after each guess
    }

    function markGuessedCharacter(guessedCharacter) {
        const sanitized = guessedCharacter.name.replace(/\s+/g, '-').toLowerCase();
        const nameElement = document.getElementById(`name-${sanitized}`);
        if (nameElement) nameElement.classList.add('guessed');
    }

    function handleGiveUp() {
        showResultModal(`You gave up. The correct answer was ${currentCharacter.name}.`);
    }

    function handlePlayAgain() {
        document.getElementById('resultModal').style.display = 'none'; // Hide the result modal
        score = 0; // Reset score
        selectNewCharacter();
    }

    function handleNames() {
        const namesListElement = document.getElementById('namesList');
        namesListElement.innerHTML = characters.map(character => {
            const sanitized = character.name.replace(/\s+/g, '-').toLowerCase();
            return `<p id="name-${sanitized}">${character.name}</p>`;
        }).join('');
        document.getElementById('namesModal').style.display = 'block';
    }

    function showResultModal(message) {
        const resultModal = document.getElementById('resultModal');
        document.getElementById('resultMessage').textContent = message;
        document.getElementById('finalScore').textContent = score;
        resultModal.style.display = 'block';

        // Setup behavior for closing the result modal
        document.querySelector('.closeResult').addEventListener('click', () => resultModal.style.display = "none");
        window.addEventListener('click', (event) => {
            if (event.target === resultModal) resultModal.style.display = "none";
        });
    }

    function animateIncorrectGuess() {
        const guessBox = document.getElementById('guessBox');
        guessBox.classList.add('incorrect-guess-animation');
        setTimeout(() => {
            guessBox.classList.remove('incorrect-guess-animation');
        }, 1000); // Reset animation after 1 second
    }

    function updateCluesBasedOnGuess(guessedCharacter, currentCharacter) {
        if (guessedCharacter.affiliation && guessedCharacter.affiliation === currentCharacter.affiliation) {
            document.getElementById('affiliationValue').textContent = currentCharacter.affiliation;
        }
        if (guessedCharacter.weapon && guessedCharacter.weapon === currentCharacter.weapon) {
            document.getElementById('weaponValue').textContent = currentCharacter.weapon;
        }
        if (guessedCharacter.forceSensitive && guessedCharacter.forceSensitive === currentCharacter.forceSensitive) {
            document.getElementById('forceValue').textContent = currentCharacter.forceSensitive;
        }
        if (guessedCharacter.planet && guessedCharacter.planet === currentCharacter.planet) {
            document.getElementById('planetValue').textContent = currentCharacter.planet;
        }
        if (guessedCharacter.species && guessedCharacter.species === currentCharacter.species) {
            document.getElementById('speciesValue').textContent = currentCharacter.species;
        }
        if (guessedCharacter.died && guessedCharacter.died === currentCharacter.died) {
            document.getElementById('diedValue').textContent = currentCharacter.died;
        }
        if (guessedCharacter.occupation && guessedCharacter.occupation === currentCharacter.occupation) {
            document.getElementById('occupationValue').textContent = currentCharacter.occupation;
        }
        if (guessedCharacter.appearedIn && currentCharacter.appearedIn) {
            const commonAppearances = guessedCharacter.appearedIn.filter(movie => currentCharacter.appearedIn.includes(movie));
            if (commonAppearances.length > 0) {
                document.getElementById('appearedInValue').textContent = commonAppearances.join(', ');
            }
        }
    }

    function clearClues() {
        document.getElementById('affiliationValue').textContent = '-';
        document.getElementById('weaponValue').textContent = '-';
        document.getElementById('forceValue').textContent = '-';
        document.getElementById('planetValue').textContent = '-';
        document.getElementById('speciesValue').textContent = '-';
        document.getElementById('diedValue').textContent = '-';
        document.getElementById('occupationValue').textContent = '-';
        document.getElementById('appearedInValue').textContent = '-';
    }
});
