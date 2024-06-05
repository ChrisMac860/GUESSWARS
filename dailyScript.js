document.addEventListener('DOMContentLoaded', function() {
    let characters = [];
    let dailyCharacters = [];
    let currentCharacter = "";
    let score = 0;
    let guesses = 0;
    const maxGuesses = 8;
    let fuse;

    setupInitialModalBehavior();
    fetchAndInitializeGame();

    function fetchAndInitializeGame() {
        Promise.all([
            fetch('STARWARSCHARACTERS.txt').then(response => response.text()),
            fetch('DAILY_CHARACTERS.txt').then(response => response.text())
        ]).then(([starWarsText, dailyText]) => {
            characters = parseCharacterData(starWarsText);
            dailyCharacters = dailyText.split('\n').map(name => name.trim()).filter(name => name);
            initializeFuse();
            initializeDailyGame();
        }).catch(error => console.error('Error fetching character data:', error));
    }

    function setupInitialModalBehavior() {
        const initialModal = document.getElementById("myModal");
        initialModal.style.display = "block";
        document.getElementById('resultModal').style.display = 'none';
        document.getElementById('namesModal').style.display = 'none';
        document.getElementById('helpModal').style.display = 'none';

        document.querySelector('.close').addEventListener('click', () => {
            initialModal.style.display = "none";
        });

        document.querySelector('.closeNames').addEventListener('click', () => {
            document.getElementById('namesModal').style.display = "none";
        });

        document.querySelector('.closeHelp').addEventListener('click', () => {
            document.getElementById('helpModal').style.display = "none";
        });

        window.addEventListener('click', (event) => {
            if (event.target === initialModal) {
                initialModal.style.display = "none";
            } else if (event.target === document.getElementById('namesModal')) {
                document.getElementById('namesModal').style.display = "none";
            } else if (event.target === document.getElementById('helpModal')) {
                document.getElementById('helpModal').style.display = "none";
            }
        });
    }

    function parseCharacterData(text) {
        return text.split('\n').reduce((acc, line) => {
            if (line.trim()) {
                const data = line.split(',').reduce((charAcc, curr) => {
                    const [key, value] = curr.split(':').map(item => item.trim());
                    charAcc[key.replace(/\s+/g, '').toLowerCase()] = key === 'Appeared in' ? value.split('/').map(v => v.trim()) : value;
                    return charAcc;
                }, {});
                acc.push(data);
            }
            return acc;
        }, []);
    }

    function initializeFuse() {
        const options = {
            keys: ['name'],
            threshold: 0.4,
        };
        fuse = new Fuse(characters, options);
    }

    function initializeDailyGame() {
        score = 0;
        guesses = 0;
        setupEventListeners();
        selectDailyCharacter();
    }

    function setupEventListeners() {
        const giveUpButton = document.querySelector('button[name="giveUpButton"]');
        const guessButton = document.querySelector('button[name="guessButton"]');
        const namesButton = document.querySelector('button[name="namesButton"]');
        const helpButton = document.getElementById('helpButton');
        const restartButton = document.getElementById('restartButton');

        guessButton.addEventListener('click', handleGuess);
        giveUpButton.addEventListener('click', handleGiveUp);
        namesButton.addEventListener('click', handleNames);
        helpButton.addEventListener('click', showHelpModal);
        restartButton.addEventListener('click', restartGame);
    }

    function selectDailyCharacter() {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const characterName = dailyCharacters[dayOfYear % dailyCharacters.length];
        currentCharacter = characters.find(char => char.name.toLowerCase() === characterName.toLowerCase());
        clearClues();
        document.getElementById('guessBox').value = '';
        console.log("Today's character:", currentCharacter);
    }

    function handleGuess() {
        if (guesses >= maxGuesses) {
            alert('No more guesses left for today!');
            return;
        }

        const guessBox = document.getElementById('guessBox');
        const userGuess = guessBox.value.trim().toLowerCase();

        const results = fuse.search(userGuess);
        console.log("Fuzzy search results:", results);

        if (results.length > 0) {
            const guessedCharacter = results[0].item;
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

        guesses++;
        score++;
        guessBox.value = ''; // Clear the guessBox after each guess

        if (guesses >= maxGuesses) {
            showResultModal(`Out of guesses! Try again tomorrow.`);
        }
    }

    function markGuessedCharacter(guessedCharacter) {
        const sanitized = guessedCharacter.name.replace(/\s+/g, '-').toLowerCase();
        const nameElement = document.getElementById(`name-${sanitized}`);
        if (nameElement) nameElement.classList.add('guessed');
    }

    function handleGiveUp() {
        score = 0; // Reset score to 0 when the player gives up
        showResultModal(`You gave up. Try again tomorrow.`);
    }

    function handleNames() {
        const namesListElement = document.getElementById('namesList');
        namesListElement.innerHTML = characters.map(character => {
            const sanitized = character.name.replace(/\s+/g, '-').toLowerCase();
            return `<p id="name-${sanitized}">${character.name}</p>`;
        }).join('');
        document.getElementById('namesModal').style.display = 'block';
    }

    function showHelpModal() {
        document.getElementById('helpModal').style.display = 'block';
    }

    function restartGame() {
        score = 0;
        guesses = 0;
        selectDailyCharacter();
        clearClues();
        document.getElementById('guessBox').value = '';
    }

    function showResultModal(message) {
        const resultModal = document.getElementById('resultModal');
        document.getElementById('resultMessage').textContent = message;
        document.getElementById('finalScore').textContent = score;
        resultModal.style.display = 'block';

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
        }, 1000);
    }

    function updateCluesBasedOnGuess(guessedCharacter, currentCharacter) {
        console.log("Guessed Character:", guessedCharacter);
        console.log("Current Character:", currentCharacter);

        if (guessedCharacter.affiliation && guessedCharacter.affiliation === currentCharacter.affiliation) {
            document.getElementById('affiliationValue').textContent = currentCharacter.affiliation;
        }
        if (guessedCharacter.weapon && guessedCharacter.weapon === currentCharacter.weapon) {
            document.getElementById('weaponValue').textContent = currentCharacter.weapon;
        }
        if (guessedCharacter.forcesensitive && guessedCharacter.forcesensitive === currentCharacter.forcesensitive) {
            document.getElementById('forceValue').textContent = currentCharacter.forcesensitive;
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
        if (guessedCharacter.appearedin && currentCharacter.appearedin) {
            const commonAppearances = guessedCharacter.appearedin.filter(movie => currentCharacter.appearedin.includes(movie));
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
