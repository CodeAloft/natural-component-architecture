
/**
 * The base component class
 */
class Component {
    rootElement;
    eventListeners;
        
    /**
     * @constructor
     */
    constructor() {
        this.eventListeners = [];
    }
    
    /**
     * Sets the component root element
     * @param {object} el  HTML element object
     */
    setRootElement(el) {
        this.rootElement = el;
    }
    
    /**
     * Creates the component HTML
     * @param {object} el  Parent HTML element
     * @param {object} data  Data used to create the component
     */
    inflate(el, data) {}
    
    /**
     * Removes the component HTML
     */
    deflate() {
        if (this.rootElement && this.rootElement.parentElement) {
            this.removeEventListeners();
            this.rootElement.parentElement.removeChild(this.rootElement);
        }
    }

    /**
     * Adds the specified event listener to the specified element and registers the listener with the component
     * @param {object} el  HTML element
     * @param {string} type  Event type
     * @param {function} listener  Function to perform when the event occurs
     */
    addEventListener(el, type, listener) {
        if (this.isElement(el)) {
            el.addEventListener(type, listener);
            
            this.eventListeners.push({
                el: el,
                type: type,
                listener: listener
            });
        }
    }
    
    /**
     * Removes all registered event listeners
     */
    removeEventListeners() {
        let i, listener;
        
        for (i = 0; i < this.eventListeners.length; i++) {
            listener = this.eventListeners[i];
            listener.el.removeEventListener(listener.type, listener.listener);
        }
    }
    
    /**
     * Returns true if the specified item is a HTML element and false otherwise
     * @param {object} item  Object to test
     */
    isElement(item) {
        return item instanceof Element || item instanceof HTMLDocument;  
    }
}


/**
 * A tic-tac-toe square
 */
class Square extends Component {
    game;
    position;
    player;
    playerHistory;
     
    /**
     * @constructor
     * @param {object} game  The tic-tac-toe game object
     * @param {number} position  Board position
     */
    constructor(game, position) {
        super();
        
        this.game = game;
        this.position = position;
    }
    
    /**
     * Creates the square HTML
     * @param {object} el  Parent HTML element
     */
    inflate(el) {
        const component = this;
        
        if (el) {
            const frag = document.createDocumentFragment();
            
            this.rootElement = document.createElement('button');
            this.rootElement.className = 'square';
            
            this.addEventListener(this.rootElement, 'click', function(){
                component.activate();
            });
              
            this.addEventListener(this.closeButton, 'keydown', function(){
                if (event.keyCode === 13 || event.keyCode === 32) {
                    component.activate();
                }
            });
        
            frag.appendChild(this.rootElement);
            el.appendChild(frag);
        }
    }

    /**
     * Assigns the square to the next player
     */
    activate() {
        if (!this.player && !this.game.winner) {
            this.playerHistory = this.game.nextPlayer;
            this.refresh();
            this.game.onMove(this.position);
        }
    }

    /**
     * Hides the current player assignment
     */
    clear() {
        this.rootElement.textContent = '';
        this.player = null;
    }

    /**
     * Shows the current player assignment
     */
    refresh() {
        this.rootElement.textContent = this.playerHistory;
        this.player = this.playerHistory;
    }
}


/**
 * A tic-tac-toe move
 */
class Move extends Component {
    game;
    position;
    index;
     
    /**
     * @constructor
     * @param {object} game  The tic-tac-toe game object
     * @param {number} position  Selected square
     */
    constructor(game, position) {
        super();
        
        this.game = game;
        this.position = position;
    }
    
    /**
     * Creates the move HTML
     * @param {object} el  Parent HTML element
     * @param {number} index  Move index
     */
    inflate(el, index) {
        const component = this;
        
        if (el) {
            this.index = index;
            
            let label = 'Go to game start';
            
            if (index > 0) {
                label = 'Go to move #' + this.index;
            }
            
            const frag = document.createDocumentFragment();
            
            this.rootElement = document.createElement('li');
            
            const buttonElement = document.createElement('button');            
            buttonElement.appendChild(document.createTextNode(label));
            this.rootElement.appendChild(buttonElement);
            
            this.addEventListener(buttonElement, 'click', function(){
                component.revertGame();
            });
              
            this.addEventListener(this.closeButton, 'keydown', function(){
                if (event.keyCode === 13 || event.keyCode === 32) {
                    component.revertGame();
                }
            });
            
            frag.appendChild(this.rootElement);
            el.appendChild(frag);
        }
    }

    /**
     * Reverts the game to this move
     */
    revertGame() {
        this.game.revert(this.index);
    }
}


/**
 * A tic-tac-toe game
 */
class Game extends Component {
    squares;
    moves;
    moveIndex;
    nextPlayer;
    winner;
    statusLabel;
    moveList;
     
    /**
     * @constructor
     */
    constructor() {
        super();
        
        this.squares = [];
        this.moves = [];
        this.moveIndex = -1;
    }
    
    /**
     * Creates the board HTML
     * @param {object} el  Parent HTML element
     */
    inflate(el) {
        const component = this;
        
        if (el) {
            const frag = document.createDocumentFragment();
            
            this.rootElement = document.createElement('div');
            this.rootElement.className = 'game';
            
            const boardElement = document.createElement('div');
            boardElement.className = 'game-board';
            
            this.statusLabel = document.createElement('div');
            this.statusLabel.className = 'status-label';
            boardElement.appendChild(this.statusLabel);
            
            let i, rowElement, j, square;
            let position = 0;
            
            for (i = 0; i < 3; i++) {
                rowElement = document.createElement('div');
                rowElement.className = 'board-row';
                
                for (j = 0; j < 3; j++) {
                    square = new Square(this, position);
                    square.inflate(rowElement);
                    this.squares.push(square);
                    position++;
                }
                
                boardElement.appendChild(rowElement);
            }
            
            this.rootElement.appendChild(boardElement);            
            
            const infoElement = document.createElement('div');
            infoElement.className = 'game-info';
            
            this.moveList = document.createElement('ol');
            infoElement.appendChild(this.moveList);
            
            this.rootElement.appendChild(infoElement);
            frag.appendChild(this.rootElement);
            el.appendChild(frag);
            
            // Add the Go to Start button
            this.onMove(-1);            
        }
    }
    
    /**
     * Adds a new move to the move list
     * @param {number} position  Position of the selected square
     */
    onMove(position) {
        this.refreshMoves();        
        this.moveIndex++;
        
        const move = new Move(this, position);
        
        move.inflate(this.moveList, this.moveIndex);
        this.moves.push(move);
        
        this.updateGameStatus()
    }
    
    /**
     * Reverts the game to the specified move
     * @param {number} moveIndex  Move index
     */
    revert(moveIndex) {
        let i, move, square;
        
        for (i = this.moves.length - 1; i > 0; i--) {
            move = this.moves[i];         
            square = this.squares[move.position];            
            this.nextPlayer = square.player;
            
            if (i > moveIndex) {
                square.clear();
            }
            else {
                square.refresh();
            }
        }
        
        this.moveIndex = moveIndex;
        this.updateGameStatus();
        this.winner = null;
    }
    
    /**
     * Removes all moves above the current move index
     */
    refreshMoves() {
        let i, move;
        
        for (i = this.moves.length - 1; i > this.moveIndex; i--) {
            move = this.moves.pop();  
            move.deflate();
        }
    }
    
    /**
     * Updates the status label after checking if there is a winner
     */
    updateGameStatus() {        
        const xIsNext = this.moveIndex % 2 === 0;        
        
        if (xIsNext) {
            this.nextPlayer = 'X'
        }
        else {
            this.nextPlayer = '0'
        }        
        
        this.winner = this.calculateWinner();
        
        if (this.winner) {
            this.statusLabel.textContent = 'Winner: ' + this.winner;
        }
        else {
            this.statusLabel.textContent = 'Next Player: ' + this.nextPlayer;
        }
    }
    
    /**
     * Checks if there is a winner
     */
    calculateWinner() {
        const lines = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
        ];
        
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            
            if (this.squares[a].player && this.squares[a].player === this.squares[b].player && this.squares[a].player === this.squares[c].player) {
                return this.squares[a].player;
            }
        }
        return null;
    }
}

const gameContainer = document.querySelector('#game-container');

const game = new Game();
game.inflate(gameContainer);
            