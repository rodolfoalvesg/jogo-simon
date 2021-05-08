
let keyboard = false; // Controle de teclas
let score = 0; // Contador do Score
let userPlay = false; // Controle de click externo
let highest = 0; // Contador de Highst Interno
let userHighest = 0; // Contador de Highst Interno
let sequence = []; // Vetor de Cores Computador
let userSequence = []; // Vetor de Cores usuário
let replaySequence = []; // Vetor de Replay Usuário
let finishGame = true; // Controle de Game Over
let difficulty = 16; // Dificuldade Padrão
let clockGame = 5; // Controle de Tempo para Game Over
let clockGameOver = true; // Controle de Tempo para Game Over
let countLife = 0; // Controle de espera de Game Over;
let countRoundTime = 0; // Controle de rodadas
let countClick = 0 // Controle de Cliks


// Captura de Audios
let audioGreen = document.getElementById("clip1"); 
let audioRed = document.getElementById("clip2");
let audioBlue = document.getElementById("clip3");
let audioYellow = document.getElementById("clip4");
let audioGameOver = document.getElementById("clip5");
let audioWin = document.getElementById("clip6");



// Controles e ações do tempo de jogo
class Timer{
    // Time de Mensagem reset
    timeResetMessage(){
        document.getElementById("button-start").innerHTML = "Reset Ok"
        setTimeout(() => {
            document.getElementById("button-start").innerHTML = "Play"
        }, 2500);
    }

    // Temporizador de resposta do usuário
    timeIntervalRequest(op, timeSpeedTest){ 
        let timeoutGame = timeSpeedTest
        clockGame = timeoutGame/1000
       
        if(op){  
            this.intervalCountGame = setInterval(() => {
                clockGame--;
                document.getElementById("button-start").innerHTML = `${clockGame}s`
                if(clockGame == 0){
                    clearInterval(this.intervalCountGame);
                    clockGame = timeoutGame/1000;
                }
            }, 1000);

            this.timeoutCountGame = setTimeout(() => {
                simon.gameOver();
            }, timeoutGame);
        }else{
            clearInterval(this.intervalCountGame);
            clearTimeout(this.timeoutCountGame);
            clockGame = timeoutGame/1000;
        }
    }

    // O computador acende a sequência no tempo determinado
    timeLightColor(_getElementColor, _getStyleColor, _getValueSequence){
        setTimeout(() => {
            document.getElementById(_getElementColor).style.background = _getStyleColor;
            simon.audio(_getElementColor);
        }, _getValueSequence - 250);

        setTimeout(() => {
            //elementColor.classList.remove('selected');
            document.getElementById(_getElementColor).style.background = "";
        }, _getValueSequence);
    }

    // Tempo de resposta do clique 
    timeClicks(_getIdColorUser, _getElementColorUser){
        setTimeout(() => {
            //createColorBackground(color).classList.remove('selected');
            this.elementColorUser = simon.createColorBackground(_getIdColorUser);
            document.getElementById(_getElementColorUser).style.background = "";
            simon.checkSequence();
        },250);
    }

    // Tempo de resposta para Game Over
    timeGameOver(){
        setTimeout(() => {
            simon.turnOffRed();
            document.getElementById("button-start").innerHTML = "Play"
            document.getElementById("button-start").disabled = 0;
            document.getElementById("button-replay").style.display = "inline-block";
            document.getElementById("reset").style.display = "inline-block";
            document.getElementById("back").style.display = "inline-block";
            document.getElementById("quit").style.display = "none";
            document.getElementById("display-score").innerHTML = 0;
            simon.scoreDisplay();
            simon.highestDisplay();
            replaySequence = sequence;
            sequence = [];
            userSequence = [];
            score = 0;
            highest = 0;
            userPlay = false;
            finishGame = true;
            this.clockGame = 5;
            countRoundTime = 0;
            countClick = 0;
            
        }, 5000);
    }

}

// Controles e Ações do Jogo
class Simon{

    //Replay Game Over
    replay(){
        for(let x in replaySequence){
            let elementColorReplay = this.createColorBackground(replaySequence[x]);
            this.lightColor(elementColorReplay, (Number(x)+1));
        }
    }

    // Reset Highest
    reset() {
        if(!userPlay){
            document.getElementById("display-highest").innerHTML = 0;
            document.getElementById("button-replay").style.display = "none";
            userHighest = 0;
            document.getElementById("display-score").innerHTML = 0;
            this.selectDifficulty(4, 20000);
            this.displayOptionsKey(1);
            time.timeResetMessage();
        }
    }

    // Ação das teclas
    insertedKeys(op) {
        let [keyGreen, keyRed, keyYellow, keyBlue] = [this.keyGreen, this.keyRed, this.keyYellow, this.keyBlue]
        let listener = function (event) {
            if (event.defaultPrevented) {
                return; // Do nothing if the event was already processed
            }

            let getKey = event.key


            if(getKey == keyGreen){
                simon.clicks(0)
            }else if(getKey == keyRed){
                simon.clicks(1)
            }else if(getKey ==keyYellow){
                simon.clicks(2)
            }else if(getKey == keyBlue){
                simon.clicks(3)
            }else{
                console.log("Tecla Invalida")
            }
            
            // Cancel the default action to avoid it being handled twice
            event.preventDefault()
        }

        if(op){
            
            window.addEventListener("keyup", listener, true);
        }
    }

    // Controle de teclas
    functionReadKey(op) {
        let buttonSelector = document.getElementById(`key${op}`);
        buttonSelector.addEventListener('keyup', (event) => {
            var buttonSelector = event.key;
            document.getElementById(`k${op}`).value = event.key;
        
            switch (op) {
                case 1:
                    this.keyGreen = buttonSelector
                    break;
                    
                case 2:
                    this.keyRed = buttonSelector
                    break;

                case 3:
                    this.keyYellow = buttonSelector
                    break;

                case 4:
                    this.keyBlue = buttonSelector
                    break;

                default:
                    break;
            }

            //return textBox2;
        })
    }

    // Controle de dificuldade
    selectDifficulty(op, _timeSpeed) {
        this.timeSpeed = _timeSpeed;
        switch (op) {
            case 1:
                document.getElementById("d1").checked = true;
                this.difficulty = 5;
                break;

            case 2:
                document.getElementById("d2").checked = true;
                this.difficulty = 16;
                
                break;
            
            case 3:
                document.getElementById("d3").checked = true;
                this.difficulty = 32;
                
                break;
        
            default:
                document.getElementById("d2").checked = true;
                this.difficulty = 16;
                break;
        }
    }
    
    //Limpa background verde quando o usuário ganha
    turnOffGreen() {
        document.getElementById(`circle`).style.background = "";  
    }

    //Exibe background verde quando o usuário ganha
    flashGreen() {
       document.getElementById(`circle`).style.background = "radial-gradient(#6ce29b,#193f28)";  
    }

    //Trata dos dados quando o usuário ganha
    win() {
        document.getElementById("button-start").innerHTML = "Win!!!"
        audioWin.play();
        this.flashGreen()
        setTimeout(() => {
            document.getElementById("button-start").innerHTML = "Play"
            document.getElementById("button-start").disabled = 0;
            document.getElementById("display-score").innerHTML = 0;
            document.getElementById("reset").style.display = "inline-block";
             document.getElementById("back").style.display = "inline-block";
             document.getElementById("quit").style.display = "none";
            sequence = [];
            score = 0;
            highest = 0;
            userPlay = false;
            this.turnOffGreen();
            this.scoreDisplay();
            this.highestDisplay();
            this.clockGame = 5
        }, 5000);
    }
  
    //Limpa background vermelho quando o usuário perde
    turnOffRed() {
        document.getElementById(`circle`).style.background = "";
    }
    
    //Exibe background vermelho quando o usuário perde
    flashRed() {
        document.getElementById(`circle`).style.background = "radial-gradient(#f1aaaa,#bb0909)";
    }

    // Trata dos dados quando o usuário perde
    gameOver(){
        document.getElementById("button-start").innerHTML = "Game over!"
        audioGameOver.play();
        this.flashRed();
        time.timeGameOver();
    }

    // Verifica se o usuário perdeu ou ganhou
    checkSequence(){
        for(let i in userSequence) {
            if(userSequence[i] != sequence[i]) {
                userPlay = false;
                time.timeIntervalRequest(this.clickGameOver=false, this.timeSpeed)
                this.gameOver();
                finishGame = 0;
                break;
            }
        }

        if(finishGame){
            if(userSequence.length == sequence.length) {
                    this.score++;
                    highest++;
                if(sequence.length == this.difficulty){
                    document.getElementById("display-highest").innerHTML = highest;
                    this.win();
                    time.timeIntervalRequest(this.clickGameOver=false, this.timeSpeed)
                }else{
                  
                    setTimeout(() => {
                        document.getElementById("button-start").innerHTML = "next round";
                        time.timeIntervalRequest(this.clickGameOver=false, this.timeSpeed);
                        countClick = 0;
                        this.nextLevel();
                    }, 500);
                    
                }
            }
        }
    }

    // Recebe o clique do usuario e armazena no vetor para verificação
    clicks(_idColorUser){
        countClick++;

            this.idColorUser = _idColorUser;
            if(userPlay){
                if(countClick < sequence.length+1){
                    userSequence.push(this.idColorUser)
                    let elementColorUser = this.createColorBackground(this.idColorUser)

                    switch (elementColorUser) {
                        case "b1":
                            var styleColor = "radial-gradient(#6ce29b,#193f28)";
                            this.audioClick = audioGreen;
                        break;
                        
                        case "b2":
                            var styleColor = "radial-gradient(#f1aaaa,#bb0909)";
                            this.audioClick = audioRed;
                        break;
                        
                        case "b3":
                            var styleColor = "radial-gradient(rgb(255, 253, 122),rgb(68, 67, 4))";
                            this.audioClick = audioBlue;
                        break;
                        
                        case "b4":
                            var styleColor = "radial-gradient(rgb(181, 223, 250),rgb(6, 90, 187))";
                            this.audioClick = audioYellow;
                        break;
                    
                        default:
                        break;
                    }


                    document.getElementById(elementColorUser).style.background = styleColor;
                    this.audioClick.play();

                    time.timeClicks(this.idColorUser, elementColorUser);
                }
            }else{
                console.log("Você não pode fazer isso o jogo não foi iniciado")
            }
       
    }

    // Chama som
    audio(_colorAudio) {
        this.colorAudio = _colorAudio;
        switch (this.colorAudio) {
            case "b1":
                audioGreen.play();
                break;
            
            case "b2":
                audioRed.play()
                break;

            case "b3":
                audioBlue.play()
                break;

            case "b4":
                audioYellow.play();
                break;
        
            default:
                break;
        }
    }

    // Light Display
    lightColor(_elementColor, _valueSequence) {
        this.elementColor = _elementColor;
        this.valueSequence = _valueSequence;

       
        if(countRoundTime<5){
            this.valueSequence *= 1000;
        }else if(countRoundTime >= 5 && countRoundTime < 16){
             this.valueSequence *= 750;
        }else if(countRoundTime >= 16){
            this.valueSequence *= 500;
        }
        
        switch (this.elementColor) {
            case "b1":
                var styleColor = "radial-gradient(#6ce29b,#193f28)";
                break;
            
            case "b2":
                var styleColor = "radial-gradient(#f1aaaa,#bb0909)";
                break;
            
            case "b3":
                var styleColor = "radial-gradient(rgb(255, 253, 122),rgb(68, 67, 4))";
                break;
            
            case "b4":
                var styleColor = "radial-gradient(rgb(181, 223, 250),rgb(6, 90, 187))";
                break;
            
            default:
                break;
        }
        
        time.timeLightColor(this.elementColor, styleColor, this.valueSequence);
    
    }

    // Cria background
    createColorBackground(_idColor){
        this.idColor = _idColor;
        if(this.idColor == 0) {
            return "b1";
        } else if(this.idColor == 1) {
            return "b2";
        } else if (this.idColor == 2) {
            return "b3";
        } else if (this.idColor == 3) {
            return "b4";
        }
    }

     // Cria cor e chama, criar o fundo e acende as luzes
    randomOrder() {
        let createColor = Math.floor(Math.random() * 4);
        sequence.push(createColor)
        userSequence = [];
        
        
        for(let x in sequence){
            let elementColor = this.createColorBackground(sequence[x]);
            this.lightColor(elementColor, (Number(x)+1));
        }
        
        countLife = Number(this.timeSpeed)
        time.timeIntervalRequest(this.clickGameOver=true, countLife);
        
        countRoundTime++;
    }

    // Exibe as informações de Highest
    highestDisplay() {
        if(userHighest <= highest){
            userHighest = highest;
            document.getElementById("display-highest").innerHTML = userHighest;
        }
    }

    // Exibe as informações de score no display
    scoreDisplay() {
        document.getElementById("display-score").innerHTML = this.score;
    }

    //Coordena as funções de Exibir resultados e Random de Cores
    nextLevel() {
        this.scoreDisplay();
        this.highestDisplay();
        this.randomOrder();
        this.insertedKeys(this.keyboard)
    }

    // Inicia o jogo ao clicar no play
    startGame() {
        document.getElementById("button-start").disabled = 1;
        document.getElementById("button-replay").style.display = "none";
        document.getElementById("reset").style.display = "none";
        document.getElementById("back").style.display = "none";
        this.score = 0;
        this.nextLevel();
        userPlay = true;
        countClick = 0;
        replaySequence = []
        document.getElementById("quit").style.display = "inline-block";
    }
    
    // Controle de display de configurações do teclado
    displayOptionsKey(_opKey) {
        this.opKey = _opKey;

        if(this.opKey == 1){
            this.keyboard = false;
            document.getElementById("optionKey").style.display = "none"
            document.getElementById("model-genius").style.display = "none"
            document.getElementById("color-model").style.display = "none"

               
        }else if(this.opKey == 2){
            this.keyboard = true;
            document.getElementById("optionKey").style.display = "block"
            document.getElementById("color-model").style.display = "block"
            document.getElementById("model-genius").style.display = "block"
        }
    }

    // Controla a exibição e troca dos frames
    menu(_op) {
        this.op = _op;
        switch (this.op) {
            case 0:
                this.startPage();
                document.getElementById("menu").style.display = "flex";
                break;

            case 1:
                document.getElementById("menu").style.display = "none";
                document.getElementById("header").style.display = "none";
                document.getElementById("headerGame").style.display = 'block';
                document.getElementById("game").style.display = 'block';
                document.getElementById("row").style.display = 'block';
                break;

            case 2:
                document.getElementById("menu").style.display = "none";
                document.getElementById("settings").style.display = "block";
                break;

            case 3:
                document.getElementById("menu").style.display = "none";
                document.getElementById("howtoplay").style.display = "block";
                break;
            
            case 4:
                document.getElementById("menu").style.display = "flex";
                document.getElementById("header").style.display = "flex";
                document.getElementById("headerGame").style.display = 'none';
                document.getElementById("game").style.display = 'none';
                document.getElementById("row").style.display = 'none';
                break;

            case 5:
                document.getElementById("howtoplay").style.display = "none";
                document.getElementById("menu").style.display = "flex";
                break;

            default:
                break;
        }
    }
    
    //Esconde os blocos na inicialização
    startPage(){
        document.getElementById("settings").style.display = 'none';
        document.getElementById("howtoplay").style.display = 'none';
        document.getElementById("headerGame").style.display = 'none';
        document.getElementById("game").style.display = 'none';
        document.getElementById("row").style.display = 'none';
        document.getElementById("button-replay").style.display = 'none';
        document.getElementById("quit").style.display = "none";
    }
}



// Instância Timer
let time = new Timer();

// Instância Game Simon
let simon = new Simon();

// Onloads da Página Principal
simon.startPage();

// Start das opções de controle mouse
simon.displayOptionsKey(1);

// Start da dificultade Padrão.
simon.selectDifficulty(4, 20000);
