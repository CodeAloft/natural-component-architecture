
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
                component.jumpTo();
            });
              
            this.addEventListener(this.closeButton, 'keydown', function(event){
                if (event.keyCode === 13 || event.keyCode === 32) {
                    component.jumpTo();
                }
            });
            
            frag.appendChild(this.rootElement);
            el.appendChild(frag);
        }
    }

    /**
     * Jumps to this move
     */
    jumpTo() {
        this.game.jumpToMove(this.index);
    }
}
