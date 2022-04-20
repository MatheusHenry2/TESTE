var palavra, vitorias = 0;

//Pegando palavra aleatoria do dicionario em inglês do servidor backend.
const getPalavraIngles = () => {
    fetch('http://localhost:80/palavraIngles')
        .then(response => response.json())
        .then(json => {
            console.log(json)
            palavra = json;
        })
        .catch(err => console.log(err))
}


//pegando palavra aleatorio do dicionario em português do servidor backend
const getPalavraPortugues = () => {
    fetch('http://localhost:80/palavraPortugues')
        .then(response => response.json())
        .then(json => {
            console.log(json)
            palavra = json;
        })
        .catch(err => console.log(err))
}

//Mostrando resultado na tela de vitoria criado.
async function resultado() {
    let resultContainer = document.getElementById('results-container');

    try {
        const response = await fetch(`http://localhost:80/result`)
        const data = await response.json()

        resultContainer.innerHTML = `
        <p>Total de vencedores: ${data.Vencedores}</p>
        <p>Nivel 1: ${data.level.primeiro}</p>
        <p>Nivel 2: ${data.level.segundo}</p>
        <p>Nivel 3: ${data.level.terçeiro}</p>
        <p>Nivel 4: ${data.level.quarto}</p>
        <p>Nivel 5: ${data.level.cinco}</p>
        <p>Nivel 6: ${data.level.seis}</p>
      `;

    } catch (error) {
        console.log(error)
    }
}

//atualizando numero de vencedores por nivel
async function atualizarResultado(level) {

    let nivel;

    if (level == 1) {
        nivel = 'primeiro';
    } else if (level == 2) {
        nivel = 'segundo'
    } else if (level == 3) {
        nivel = 'terçeiro'
    } else if (level == 4) {
        nivel = 'quarto'
    } else if (level == 5) {
        nivel = 'cinco'
    } else {
        nivel = 'seis'
    }
    await fetch(`http://localhost:80/result/${nivel}`, {
        method: 'PUT',
    });
}


document.addEventListener("DOMContentLoaded", () => {
    createSquares();
    let inicioLinguagemAleatoria = Math.floor(Math.random() * (10 - 1)) + 1;

    let modal = document.getElementById("myModal");
    let span = document.getElementsByClassName("close")[0];

    document.getElementById('play-again-btt').addEventListener('click', async() => {
        modal.style.display = "none";
        await reset();
    })

    async function reset() {
        document.getElementById("board").innerHTML = "";

        createSquares();
        guessedWords = [
            []
        ];

        availableSpace = 1;
        guessedWordCount = 0;
        getPalavraIngles();
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    if (inicioLinguagemAleatoria % 2 == 0) {
        getPalavraIngles();
    } else {
        getPalavraPortugues();
    }

    const keys = document.querySelectorAll('.keyboard-row button');
    let guessedWords = [
        []
    ];
    let availableSpace = 1;

    let guessedWordCount = 0;

    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = async({ target }) => {
            const letter = target.getAttribute("data-key");

            if (letter === "enter") {
                await submitWord();
                return;
            }

            if (letter === "delete") {
                apagarLetraTela();
                return;
            }

            updateGuessedWords(letter);
        };
    }

    function apagarLetraTela() {
        const currentWordArr = getCurrentWordArr();
        const removerLetra = currentWordArr.pop();

        guessedWords[guessedWords.length - 1] = currentWordArr

        const ultimaLetra = document.getElementById(String(availableSpace - 1))

        ultimaLetra.textContent = '';

        availableSpace = availableSpace - 1;
    }

    function getChangeColor(letter, index) {
        const isLetraCorreta = palavra.includes(letter);

        if (!isLetraCorreta) {
            return "rgb(58, 58 , 60)";
        }
        const letterPosicao = palavra.charAt(index)
        const isPosicaoCorreta = (letter === letterPosicao);

        if (isPosicaoCorreta) {
            return "rgb(83, 141 , 78)";
        }

        return "rgb(181, 159 , 59)";
    }


    function submitWord() {
        const currentWordArr = getCurrentWordArr();
        if (currentWordArr.length !== 5) {
            window.alert("palavra precisa de 5 letras")
        }
        const currentWord = currentWordArr.join('');

        const firstLetterId = guessedWordCount * 5 + 1;
        const interval = 200;
        currentWordArr.forEach((letter, index) => {
            setTimeout(() => {
                const titleColor = getChangeColor(letter, index);
                const letterId = firstLetterId + index;
                const letterEl = document.getElementById(letterId);
                letterEl.classList.add("animate__flipInX");
                letterEl.style = `background-color:${titleColor};border-color:${titleColor}`;
            }, interval * index)
        })

        guessedWordCount += 1;

        if (currentWord === palavra) {
            atualizarResultado(guessedWords.length);
            modal.style.display = "block";
            resultado();
        }
        if (guessedWords.length === 6) {
            window.alert("você perdeu! a palavra era " + palavra)
            reset();
        }
        guessedWords.push([]);
    }

    function createSquares() {
        const gameBoard = document.getElementById("board")

        for (let i = 0; i < 30; i++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id", i + 1);
            gameBoard.appendChild(square);
        }
    }

    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords - 1];
    }

    function updateGuessedWords(letter) {
        const currentWordArr = getCurrentWordArr()

        if (currentWordArr && currentWordArr.length < 5) {
            currentWordArr.push(letter);
            const availableSpaceEl = document.getElementById(String(availableSpace));
            availableSpace = availableSpace + 1;
            availableSpaceEl.textContent = letter;
        }
    }

})