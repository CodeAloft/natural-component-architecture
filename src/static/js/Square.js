
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
              
            this.addEventListener(this.closeButton, 'keydown', function(event){
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
