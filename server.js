const express = require('express')
const port = process.env.PORT || 80
const app = express();
const cor = require("cors")
const path = require('path')
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(cor())

// renderizando estaticamente a tela do game.
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})


//dicionario em português 20 palavras
dicionarioPortugues = ["sagaz", "negro", "mexer", "termo", "nobre", "afeto", "sutil", "audaz", "fazer", "inato", "ideia", "moral", "honra", "muito", "tange", "sobre", "sonho", "haver", "amigo", "posse"]

//dicionario em inglês com 20 palavras
dicionarioIngles = ["array", "world", "lette", "empty", "facil", "frank", "rival", "react", "dread", "skull", "clock", "terms", "tread", "probe", "sales", "lucky", "dates", "sword", "crawl", "brief"]

let results = { Vencedores: 0, level: { primeiro: 0, segundo: 0, terçeiro: 0, quarto: 0, cinco: 0, seis: 0 } };

//Rota para pegar palavras em inglês
app.get('/palavraIngles', function(req, res) {
    let palavraAleatorio = Math.floor(Math.random() * (20 - 1)) + 1;
    res.json(dicionarioIngles[palavraAleatorio])

});

//Rota para pegar palavras em português
app.get('/palavraPortugues', function(req, res) {
    let palavraAleatorio = Math.floor(Math.random() * (20 - 1)) + 1;
    res.json(dicionarioPortugues[palavraAleatorio])
});

//rota para contabilização de vencedores em determinados niveis
app.put('/result/:level', (req, res) => {
    let level = req.params.level;
    results.Vencedores += 1;
    results.level[level] += 1;
});

//pegando para jogar na tela de vitoria os vencedores
app.get('/result', (req, res) => {
    return res.json(results);
});

app.listen(port, () => {
    console.log('Server has started in port ' + port);
})