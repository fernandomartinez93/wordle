const maxAttempts = 6;
let attempts = 0;
let secretWord = "";
const apiUrl = 'https://clientes.api.greenborn.com.ar/public-random-word?c=1&l=5';

document.addEventListener('DOMContentLoaded', (event) => {
    createGameBoard();
    obtenerNuevaPalabra();
});

function createGameBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = ''; 
    for (let i = 0; i < maxAttempts; i++) {
        for (let j = 0; j < 5; j++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.id = `tile-${i}-${j}`;
            gameBoard.appendChild(tile);
        }
    }
}

async function obtenerNuevaPalabra() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Error al obtener la palabra de la API');
        }
        const data = await response.json();
        secretWord = data[0].toLowerCase();
        console.log(`Palabra secreta obtenida: ${secretWord}`);
    } catch (error) {
        console.error('Error:', error);
        const palabras = [
            "techo", "perro", "grito", "pollo", "silla", "libro", "limon", "plato", "raton",
            "luces", "coche", "arena", "playa", "pieza", "pasta", "parto", "grifo",
             "arbol", "lucir", "solar", "oreja", "fuego", "media", "nieve", "gotas", "jabon"
        ];
        secretWord = palabras[Math.floor(Math.random() * palabras.length)].toLowerCase();
        console.log(`Palabra secreta (fallback) obtenida: ${secretWord}`);
    }
}

async function checkGuess() {
    const userGuess = document.getElementById("guess").value.toLowerCase().trim();
    const message = document.getElementById("message");

    if (userGuess.length !== 5) {
        message.textContent = "Por favor, introduce una palabra de 5 letras.";
        return;
    }

    if (attempts >= maxAttempts) {
        message.textContent = `Has alcanzado el número máximo de intentos. La palabra era: ${secretWord}`;
        return;
    }

    updateBoard(userGuess);
    attempts++;

    if (userGuess === secretWord) {
        message.textContent = "¡Correcto! Has adivinado la palabra.";
    } else if (attempts >= maxAttempts) {
        message.textContent = `Has alcanzado el número máximo de intentos. La palabra era: ${secretWord}`;
    } else {
        message.textContent = "Inténtalo de nuevo.";
    }

    document.getElementById("guess").value = '';
}

function updateBoard(userGuess) {
    for (let i = 0; i < 5; i++) {
        const tile = document.getElementById(`tile-${attempts}-${i}`);
        tile.textContent = userGuess[i];

        if (userGuess[i] === secretWord[i]) {
            tile.classList.add('correct');
        } else if (secretWord.includes(userGuess[i])) {
            tile.classList.add('present');
        } else {
            tile.classList.add('absent');
        }
    }
}

function resetGame() {
    attempts = 0;
    document.getElementById('message').textContent = '';
    document.getElementById('guess').value = '';
    createGameBoard();
    obtenerNuevaPalabra();
}
