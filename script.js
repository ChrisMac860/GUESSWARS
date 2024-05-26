document.addEventListener('DOMContentLoaded', function() {
    let characters = [];
    let currentCharacter = "";
    let score = 0;

    setupInitialModalBehavior();
    fetchAndInitializeGame();

    function fetchAndInitializeGame() {
        fetch('STARWARSCHARACTERS.txt')
            .then(response => response.text())
            .then(text => {
                characters = parseCharacterData(text);
                initializeGame();
            })
            .catch(error => console.error('Error fetching characters:', error));
    }

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

    function parseCharacterData(text) {
        return text.split('\n').reduce((acc, line) => {
            if (line.trim()) {
                const data = line.split(',').reduce((charAcc, curr) => {
                    const [key, value] = curr.split(':').map(item => item.trim());
                    charAcc[key] = key === 'Appeared in' ? value.split('/').map(v => v.trim()) : value;
                    return charAcc;
                }, {});
                acc.push(data);
            }
            return acc;
        }, []);
    }

    function initializeGame() {
        score = 0;
        setupEventListeners();
        selectNewCharacter();
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
        const guessedCharacter = characters.find(char => char.Name.toLowerCase() === userGuess);

        if (guessedCharacter) {
            markGuessedCharacter(guessedCharacter);
            const isCorrectGuess = guessedCharacter.Name === currentCharacter.Name;
            updateCluesBasedOnGuess(guessedCharacter, currentCharacter);
            if (isCorrectGuess) {
                showResultModal(`Correct! It was ${currentCharacter.Name}.`);
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
        const sanitized = guessedCharacter.Name.replace(/\s+/g, '-').toLowerCase();
        const nameElement = document.getElementById(`name-${sanitized}`);
        if (nameElement) nameElement.classList.add('guessed');
    }

    function handleGiveUp() {
        showResultModal(`You gave up. The correct answer was ${currentCharacter.Name}.`);
    }

    function handlePlayAgain() {
        document.getElementById('resultModal').style.display = 'none'; // Hide the result modal
        score = 0; // Reset score
        selectNewCharacter();
    }

    function handleNames() {
        const namesListElement = document.getElementById('namesList');
        namesListElement.innerHTML = characters.map(character => {
            const sanitized = character.Name.replace(/\s+/g, '-').toLowerCase();
            return `<p id="name-${sanitized}">${character.Name}</p>`;
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
        if (guessedCharacter.Affiliation && guessedCharacter.Affiliation === currentCharacter.Affiliation) {
            document.getElementById('affiliationValue').textContent = currentCharacter.Affiliation;
        }
        if (guessedCharacter.Weapon && guessedCharacter.Weapon === currentCharacter.Weapon) {
            document.getElementById('weaponValue').textContent = currentCharacter.Weapon;
        }
        if (guessedCharacter['Force sensitive'] && guessedCharacter['Force sensitive'] === currentCharacter['Force sensitive']) {
            document.getElementById('forceValue').textContent = currentCharacter['Force sensitive'];
        }
        if (guessedCharacter.Planet && guessedCharacter.Planet === currentCharacter.Planet) {
            document.getElementById('planetValue').textContent = currentCharacter.Planet;
        }
        if (guessedCharacter.Species && guessedCharacter.Species === currentCharacter.Species) {
            document.getElementById('speciesValue').textContent = currentCharacter.Species;
        }
        if (guessedCharacter.Died && guessedCharacter.Died === currentCharacter.Died) {
            document.getElementById('diedValue').textContent = currentCharacter.Died;
        }
        if (guessedCharacter.Occupation && guessedCharacter.Occupation === currentCharacter.Occupation) {
            document.getElementById('occupationValue').textContent = currentCharacter.Occupation;
        }
        if (guessedCharacter['Appeared in'] && currentCharacter['Appeared in']) {
            const commonAppearances = guessedCharacter['Appeared in'].filter(movie => currentCharacter['Appeared in'].includes(movie));
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
