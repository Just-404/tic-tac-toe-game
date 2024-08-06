//Digits value: 
// 0 = empty cell,
// 1 = O, 
// 2 = X for the game display

function BoardCell() {
    let value = 0;

    const playerSelection = (playerValue) => {
        value = playerValue;
    } 

    const getPlayerSelection = () => value;

    return {
        playerSelection,
        getPlayerSelection,
    }
}

function GameBoard(){
    const rows = 3;
    const cols = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];

        for (let j = 0; j < cols; j++) {
            board[i].push(BoardCell());
            
        }
    }

    const clearBoard = () => {
        board.forEach((row) => row.forEach((cell) => cell.playerSelection(0)));
    }
    
    const getBoard = () => board;
   
    const placeToken = (playerSel, cellRow, cellCol) => {
                
        const playableCell = board.filter((row) =>( row === board[cellRow] && row[cellCol].getPlayerSelection() === 0)).map((row) => row[cellCol]); 
        
        if(!playableCell.length) return "Cell is not empty";

        board[cellRow][cellCol].playerSelection(playerSel);
    }

    const printBoard = ()=>{
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getPlayerSelection()))
        console.log(boardWithCellValues);
    }
    return{
        getBoard,
        placeToken,
        printBoard,
        clearBoard,
    }
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two"){
   
    const board = GameBoard();

    const players = [
        {
            name: playerOneName,
            token: 1,
        },
        {
            name: playerTwoName,
            token: 2,
        },
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        (activePlayer === players[0]) ? activePlayer = players[1] : activePlayer = players[0];
    }

    const getActivePlayer = () => activePlayer;

    const displayRound = () => {
        board.printBoard();
        console.log(`\nIt\'s ${getActivePlayer().name} turn.`);
        console.log("Placing token...");        


    }

    const checkWinning = () => {
        const player1 = players[0].token;
        const player2 = players[1].token;
        const boardArr = board.getBoard().map((row) => row.map((cell) => cell.getPlayerSelection()));
        const winningArrayPlayer1 = [player1, player1, player1];
        const winningArrayPlayer2 = [player2, player2, player2]

        const checkRowWin = (arr, playerArr) => arr.find((row) => row.every((elem, idx) => elem === playerArr[idx]));
        
        const checkColWin = (arr, playerArr) => {

            for(let i=0; i<3; i++){
                let col = [];

                for (let j = 0; j < 3; j++) {
                    col.push(arr[j][i]);                    
                }

                if(col.every((elem, idx) => elem === playerArr[idx])){
                    return true;
                };
            }        
          
        }

        const checkDiagWin = (arr, playerArr) => {
            let diag = [];

            for(let i=0; i<3; i++){
                diag.push(arr[i][i]);                                

            }  
            if(diag.every((elem, idx) => elem === playerArr[idx])){
                return true;
            };
        }

        const checkAntiDiagWin = (arr, playerArr) => {
          
            let antiDiag = [];      

            for(let i=0; i<3; i++){

                for(let j=2; j>=0; j--){
                    if(i+j == 2) antiDiag.push(arr[i][j]);
                }
            }
            if(antiDiag.every((elem, idx) => elem === playerArr[idx])){
                return true;
            };
        }

        const wonBy = ()=>{
            if(checkRowWin(boardArr, winningArrayPlayer1) || checkRowWin(boardArr, winningArrayPlayer2)) {
                return "wins by row.";
            }
            else if(checkColWin(boardArr, winningArrayPlayer1) || checkColWin(boardArr, winningArrayPlayer2)){
                return "wins by column.";
            }
            else if(checkDiagWin(boardArr, winningArrayPlayer1) || checkDiagWin(boardArr, winningArrayPlayer2)){
                return "wins by diagonal.";
            }
            else if(checkAntiDiagWin(boardArr, winningArrayPlayer1) || checkAntiDiagWin(boardArr, winningArrayPlayer2)){
                return "wins by anti-diagonal.";
            }
           
        }
      
        return wonBy();

    }
    const gameOver = (winMsg) => {
        if(roundsPlayed <= 9){
            board.printBoard();

            if(winMsg == "draw") {
                console.log("It's a draw!");
                winningMsg = "It's a draw!";
            }
            else {
                console.log(`${getActivePlayer().name} ${winMsg}`);
                winningMsg = `${getActivePlayer().name} ${winMsg}`;
            }
            
        }

      
    }

    const resetGame = () => {
        board.clearBoard();
        activePlayer = players[0];
        winningMsg = "";
        roundsPlayed = 0
    }

    let roundsPlayed = 0;
    let winningMsg = "";

    const getWinMsg = () => winningMsg;

    const playRound = (cellRow, cellCol) => {

       let value = board.placeToken(getActivePlayer().token, cellRow, cellCol);

       if(value == "Cell is not empty" && roundsPlayed < 9){
             console.log("Cell is not empty. Try again\n");
             displayRound();
       }
       else{
            roundsPlayed++;
            if(roundsPlayed < 10) {
                let winMsg;

                if(roundsPlayed >= 3){
                    winMsg = checkWinning();
                }

                if(winMsg) { 
                    gameOver(winMsg);
                }

                else{
                    switchPlayerTurn();
                    displayRound();   
                }
             
            }
            else{
                gameOver("draw");
                
            }
           
          
       }
       
    }

    return{ getActivePlayer, playRound, getBoard: board.getBoard, getWinMsg, resetGame}
}


(function ScreenController() {

    let game = GameController();
    let players = [];
    const boardDiv = document.querySelector(".board");
    const clearBtn = document.querySelector("#clear-btn");
    const loginDialog = document.getElementById("start-game");
    const submitBtn = document.getElementById("get-names");
    const playerOneName = loginDialog.querySelector("#player-one");
    const playerTwoName = loginDialog.querySelector("#player-two");
    const gameOverDialog = document.getElementById("gameover");

    let winMsg = "";


    const openModal = (element) => {
        element.showModal();
    }

    const closeModal = (element) => {
        element.close();
       
    }
    
    const showPlayerScreen = () => {
        openModal(loginDialog);        
    }

    const setPlayers = (event) => {

        players = [playerOneName.value, playerTwoName.value];
        setNames();
        updateScreen();

        closeModal(loginDialog);
        event.preventDefault();


    }

    const setNames = () => {
        const playerOneNameDiv = document.querySelector(".player1");
        const playerTwoNameDiv = document.querySelector(".player2");

        if(players[0] === "") players[0] = "Player One";
        if(players[1] === "") players[1] = "Player Two";

        playerOneNameDiv.textContent = players[0];
        playerTwoNameDiv.textContent = players[1];     

        game = GameController(players[0], players[1]);

    }

    const resetGame = () => {
        playerOneName.value = "";
        playerTwoName.value = "";
        closeModal(gameOverDialog);
        openModal(loginDialog);
        clearBoard();
        startGame();
    }

    const playAgain = () => {
        gameOverDialog.close();
        clearBoard();
    }

    const showEndGameScreen = (msg) => {
        const playAgainBtn = gameOverDialog.querySelector("#restart");
        const output = gameOverDialog.querySelector(".container output");
        const retBtn = gameOverDialog.querySelector("#return-btn");

        gameOverDialog.showModal();
        output.textContent = msg;

        playAgainBtn.addEventListener("click", resetGame);

        retBtn.addEventListener("click", playAgain);

    }

    const clearBoard = () => {
        game.resetGame();
        winMsg = "";
        updateScreen();
    }

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();

        board.forEach((row, rowIdx) => {
            row.forEach((elem, colIdx) => {
                const cell = document.createElement("div");
                cell.classList.add("cell");

                cell.dataset.rowIdx = rowIdx;
                cell.dataset.colIdx = colIdx;

                let cellValue = elem.getPlayerSelection();

                if(cellValue === 0){
                    cell.textContent = "";
                }
                else if(cellValue === 1){
                    cell.textContent = "O";

                }
                else{
                    cell.textContent = "X";

                }
                
                boardDiv.appendChild(cell);

            });            
        });

    
    }

    const clickBoard = (e) => {
        const rowIdx = e.target.dataset.rowIdx;
        const colIdx = e.target.dataset.colIdx;

        game.playRound(rowIdx, colIdx);
        winMsg = game.getWinMsg();

        if(winMsg != "") {
            showEndGameScreen(winMsg);

        }
        updateScreen();

    }

    const startGame = () => {
        document.addEventListener("DOMContentLoaded", showPlayerScreen);  
        submitBtn.addEventListener("click", setPlayers);  
        boardDiv.addEventListener("click", clickBoard);
        clearBtn.addEventListener("click", clearBoard);
        
    }
    
    startGame();
})()

