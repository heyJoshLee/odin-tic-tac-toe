const form = document.querySelector('form');



let GameBoard = () => {
    const gameBoardHTML = document.querySelector('#game-board');
    const messageContainer = document.querySelector('#message-container');
    const BOARD_SIZE = 9;
    const startNewGameButton = document.querySelector('#start-new-game-button');
    let state = Array(BOARD_SIZE).fill(null);
    let nextSquareId = 0;
    let currentPlayer;
    let players = [];


    const setMessageContent = (content) => {
        messageContainer.textContent = content
    }

    const newGame = function (playerName) {
        gameBoardHTML.textContent = '';
        nextSquareId = 0;
        state = Array(BOARD_SIZE).fill(null);
        players = [];
        addPlayer.call(this, ComputerPlayer());
        addPlayer.call(this, Player(playerName, "x"))
        generateBlankBoard();
        currentPlayer = players[Math.floor(Math.random() * players.length)];
        if (currentPlayer.name === 'computer') {
            setMessageContent('Computer plays first. Please make a selection.');
            computerTakeTurn();
        } else {
            setMessageContent('Please make a selection.');
        }
    }

    const generateSpace = () => {
        let space = document.createElement('div');
        space.classList.add('space');
        space.dataset.id = nextSquareId;
        gameBoardHTML.append(space);
        nextSquareId++;

        space.addEventListener('click', () => {
            clickSpaceLogic(space);
        })
    }

    const clickSpaceLogic = (space) => {
        if (checkIfWinner()) { return false; }

        if (!hasAvailableSpaces()) { 
            setMessageContent('No spaces available.')
            return false; 
        }

        if (spaceTaken(space.dataset.id)) {
            setMessageContent('Space is taken. Please choose another.')
            return false;
        }

        humanPlayerTakeTurn(space);

        if (checkIfWinner()) {
            setMessageContent(`${currentPlayer.name} is the winner!`);
        }
        else if (!hasAvailableSpaces()) {
            setMessageContent('No spaces available. Tie game.')
        } else {
            computerTakeTurn();
            if (checkIfWinner()) {
                setMessageContent(`${currentPlayer.name} is the winner!`)
            } else if (!hasAvailableSpaces()) {
                setMessageContent('No spaces available. Tie Game')
            }
        }
    }

    const humanPlayerTakeTurn = (space) => {
        currentPlayer = players[1];
        markSelection(space.dataset.id);
    }

    const markSelection = (id) => {
        let squareToChange = document.querySelector(`[data-id="${id}"]`);
        squareToChange.textContent = currentPlayer.marker;
        state[id] = currentPlayer.marker;
    }

    const computerTakeTurn = () => {
        currentPlayer = players[0];
        currentPlayer.pickSquare()
    }

    const spaceTaken = (spaceId) => {
        return !!getState()[spaceId];
    }

    const generateBlankBoard = () => {
        for (let i = 0; i < BOARD_SIZE; i++){
            generateSpace();
        }
    }

    const addPlayer = function (playerToAdd) {
        playerToAdd.setBoard(this);
        players.push(playerToAdd);
    }

    const checkIfWinner = () => {
        if (
            state[0] && (state[0] === state[1] && state[0] === state[2]) ||
            state[3] && (state[3] === state[4] && state[3] === state[5]) ||
            state[6] && (state[6] === state[7] && state[6] === state[8]) ||
            state[0] && (state[0] === state[3] && state[0] === state[6]) ||
            state[1] && (state[1] === state[4] && state[1] === state[7]) ||
            state[2] && (state[2] === state[5] && state[2] === state[8]) ||
            state[0] && (state[0] === state[4] && state[0] === state[8]) ||
            state[2] && (state[2] === state[4] && state[2] === state[6])
            ) 
        {
            return true;
        } else {
            return false;
        }
    }

    

    const getState = () => {
        return state;
    }

    const hasAvailableSpaces = () => {
        return state.some(space => {
            return !space;
        })
    }

    return {
        generateBlankBoard,
        state,
        addPlayer,
        markSelection,
        getState,
        hasAvailableSpaces,
        spaceTaken,
        newGame
    }    
};


let Player = (choosenName, markerChoice=false) => {
    let name = choosenName;
    let marker = markerChoice;
    let board;

    const getBoard = () => {
        return board;
    }

    const setBoard = boardToUse => {
        board = boardToUse;
    }

    const chooseSquare = (board, id) => {
        markSelection(id);
    }

    const chooseDefaultMarker = () => {
        if (!markerChoice) {
            marker = "COM";
        }
    }


    chooseDefaultMarker();

    return { 
        chooseSquare,
        name,
        marker,
        setBoard,
        getBoard
        }
}

const ComputerPlayer = () => {
    let { marker, board, name } = Player();
    const { setBoard, getBoard } = Player();
    name = 'computer';
    const pickSquare = () => {
        if (!getBoard().hasAvailableSpaces()) {
            console.log('No spaces left!')
            return;
        }
        let spaceToChoose;
        let indexToChoose;
                do {
                    indexToChoose = Math.floor(Math.random() * getBoard().getState().length); 
                    spaceToChoose = getBoard().state[indexToChoose];                    
                } while (spaceToChoose !== null)

        console.log('picking', indexToChoose)
        getBoard().markSelection(indexToChoose)
        return indexToChoose;
    }

    return { 
        marker,
        name,
        pickSquare,
        setBoard,
        getBoard
    }
}



let gameBoard;

form.addEventListener('submit', function(e) {
    e.preventDefault();
    let playerName = e.target.querySelector('input').value;
    gameBoard = GameBoard();
    gameBoard.newGame.call(gameBoard, playerName)
})

