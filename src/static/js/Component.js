
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
