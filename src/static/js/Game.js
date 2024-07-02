
/**
 * A tic-tac-toe game
 */
class Game extends Component {
    squares;
    moves;
    currentMoveIndex;
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
        this.currentMoveIndex = -1;
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
        this.currentMoveIndex++;
        
        const move = new Move(this, position);
        
        move.inflate(this.moveList, this.currentMoveIndex);
        this.moves.push(move);
        
        this.updateGameStatus()
    }
    
    /**
     * Jumps to the specified move
     * @param {number} moveIndex  Move index
     */
    jumpToMove(moveIndex) {
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
        
        this.currentMoveIndex = moveIndex;
        this.updateGameStatus();
        this.winner = null;
    }
    
    /**
     * Removes all moves above the current move index
     */
    refreshMoves() {
        let i, move;
        
        for (i = this.moves.length - 1; i > this.currentMoveIndex; i--) {
            move = this.moves.pop();  
            move.deflate();
        }
    }
    
    /**
     * Updates the status label after checking if there is a winner
     */
    updateGameStatus() {        
        const xIsNext = this.currentMoveIndex % 2 === 0;        
        
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
