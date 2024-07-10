# Tic-Tac-Toe
Here I implement a small tic-tac-toe game à la https://react.dev/learn/tutorial-tic-tac-toe using the software design pattern described below. This version of the game is clean, maintainable, lightweight, and fast.

### Natural Component Architecture
Natural Component Architecture (NCA) is a software design pattern that merges component-oriented and object-oriented approaches to web development. The pattern was developed as a means of creating component-based software written in JavaScript that has no dependencies on frameworks or libraries such as Angular and React. It is a simple and straightforward way to take full advantage of the many benefits of object-oriented programming when building web applications.

### The Component Class
In NCA, individual classes are used to define the various components of an application. Each of these classes inherits the properties and methods of a base class called Component by convention. 

The job of the Component class is to establish the relationship between a component instance and the HTML document used to render that component in the web browser. A component can contain all the code necessary to dynamically create its HTML representation, or we can simply link existing HTML to it. In either case the way that relevant HTML is linked to a component instance is by assigned that HTML to an instance property called rootElement by convention. Since the DOM tree is hierarchical in nature, a component can be linked to an entire section of the tree by assigning a single HTML element to the rootElement property.

If component HTML is created dynamically, this is done using a method called inflate() by convention. The method typically constructs an HTML fragment using standard Web API functions such as Document.createElement(), Document.createTextNode(), Node.appendChild(), and EventTarget.addEventListener(). It then appends the fragment to whatever HTML element is specified as an attachment point, most often an element passed to the method as a parameter. A class that extends the Component class either directly or indirectly will usually override the inflate() method of its super class.

```
/**
 * Creates the component HTML
 * @param {object} el  Parent HTML element
 * @param {object} data  Data used to create the component
 */
inflate(el, data) {
    if (this.isElement(el)) {
        const frag = document.createDocumentFragment();
        
        this.rootElement = document.createElement('div');
        // Add additional elements here

        // Example of adding an event listener to dynamic content
        this.addEventListener(this.rootElement, 'click', function(event) {
            // Perform some task here
        });

        // Example of adding text to dynamic content
        this.rootElement.appendChild(document.createTextNode('This is the root element!'));
        // Or
        this.rootElement.textContent = 'This is the root element!';

        frag.appendChild(this.rootElement);
        el.appendChild(frag);
    }
}
```

It is often useful to add a second parameter to the inflate() method. This parameter, called data by convention, is an object containing information needed to build the HTML representation of the component. Developers should avoid using the Element.innerHTML property to assign values from the data object and instead use methods and properties not vulnerable to the same security risks, such as Document.createTextNode(), Element.textContent, and Element.setHTML()(currently experimental).

If event listeners are attached to any of the HTML elements created by inflate(), it is currently good practice to store these event listeners in an instance property called eventListeners by convention. You should also implement a complementary deflate() method that removes component HTML from the DOM tree after removing any event listeners.

```  
/**
 * Removes the component HTML
 */
deflate() {
    if (this.isElement(this.rootElement) && this.rootElement.parentElement) {
        this.removeEventListeners();
        this.rootElement.parentElement.removeChild(this.rootElement);
    }
}
```

If HTML content will not be created dynamically, it can be useful to implement a method called setElement() by convention that assigns a value to rootElement and then completes whatever tasks you may want to perform at that time. For example, you may wish to find and manipulate certain child elements of rootElement using the Document.querySelector() and Document.querySelectorAll() methods. Class constructors are another logical place where HTML elements can be assigned to instance properties.

```
/**
 * Sets the component root element
 * @param {object} el  HTML element object
 */
setRootElement(el) {
    this.rootElement = el;
    // Perform additional tasks here
}
```

You may also wish to implement a method called update() by convention that updates component content without destroying the element assigned to rootElement. Updates may involve anything from reassigning the text value of a single child element to replacing the entire HTML structure associated with the component.

```
/**
 * Updates the component HTML while preserving the root element
 * @param {object} data  Data  used to update the component
 */
update(data) {
    // Make changes to component HTML here
}
```

That’s basically it. The above properties and methods are all you need to define the fundamental behavior of the Component class. A basic implementation of the Component class is demonstrated below. How you build the rest of the application is up to you.

```
/**
  * The base component class
  */
class Component {
    rootElement;
    eventListeners;

    /**
     * Class constructor
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
        // Perform additional tasks here
    }

    /**
     * Creates the component HTML
     * @param {object} el  Parent HTML element
     * @param {object} data  Data used to create the component
     */
    inflate(el, data) {
        if (this.isElement(el)) {
            const frag = document.createDocumentFragment();
            
            this.rootElement = document.createElement('div');
            // Add additional elements here

            // Example of adding an event listener to dynamic content
            this.addEventListener(this.rootElement, 'click', function(event) {
                // Perform some task here
            });

            // Example of adding text to dynamic content
            this.rootElement.appendChild(document.createTextNode('This is the root element!'));
            // Or
            this.rootElement.textContent = 'This is the root element!';

            frag.appendChild(this.rootElement);
            el.appendChild(frag);
        }
    }
    
    /**
     * Removes the component HTML
     */
    deflate() {
        if (this.isElement(this.rootElement) && this.rootElement.parentElement) {
            this.removeEventListeners();
            this.rootElement.parentElement.removeChild(this.rootElement);
        }
    }

    /**
     * Updates the component HTML while preserving the root element
     * @param {object} data  Data  used to update the component
     */
    update(data) {
        // Make changes to component HTML here
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
     * Returns true if the specified item is an HTML element and false otherwise
     * @param {object} item  Object to test
     */
    isElement(item) {
        return item instanceof Element || item instanceof HTMLDocument;  
    }
}
```
