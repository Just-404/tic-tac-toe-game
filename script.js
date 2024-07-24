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
    }

    const playRound = (cellRow, cellCol) => {

       let value = board.placeToken(getActivePlayer().token, cellRow, cellCol);

       if(value == "Cell is not empty"){
        console.log("Cell is not empty. Try again\n");
       }
       else{
        console.log("Placing token...");

        switchPlayerTurn();
        displayRound();
       }
       
    }

    displayRound();

    return{ getActivePlayer, playRound, }
}

const game = GameController();
game.playRound(1, 2);
game.playRound(1, 2);
game.playRound(0, 2);
game.playRound(1, 2);
game.playRound(0, 2)
game.playRound(1, 0);