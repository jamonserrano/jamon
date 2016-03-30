/*
 *  Copyright (c) 2016 Viktor Honti
 *  Licensed under the MIT License.
 *  https://github.com/jamonserrano/jamon
 */

"use strict";
{
    /**
     * Class name used for hiding elements - can be overriden
     * @private
     * @type {string}
     */
    let hiddenClassName = "hidden";

    /**
     * Event listener index (used for indentifying proxied listeners)
     * @private
     * @type {number}
     */
    let listenerIndex = 1;

    /**
     * Unique property name to attach to proxied event listeners
     * @private
     * @type {symbol}
     */
    const listenerProperty = Symbol("listenerProperty");

    /**
     * CSS properties that accept numbers (to know when to not append "px"), list taken from jQuery
     * @private
     * @type {Set}
     */
    const cssNumberProperties = new Set(["columnCount", "fillOpacity", "fontWeight",
        "lineHeight", "opacity", "order", "orphans", "widows", "zIndex","zoom"]);

    /**
     * Storage for element data
     * @private
     * @type {WeakMap}
     */
    const dataMap = new WeakMap();

    /**
     * Storage for proxied event listeners
     * @private
     * @type {Map}
     */
    const proxyMap = new Map();

    /**
     * Regular expressions to indentify event types
     * @private
     * @type {Object}
     * @todo This too might be better as a Map
     */
    const EventRegExp = {
        FOCUS: /^(blur|change|focus)$/,
        FORM: /^(reset|submit)$/,
        KEYBOARD: /^key(down|press|up)$/,
        MOUSE: /^(click|dblclick|contextmenu)|(mouse(down|enter|leave|move|out|over|up))$/,
        POINTER: /^pointer(cancel|down|enter|leave|move|out|over|up)$/,
        TOUCH: /^touch(cancel|end|move|start)$/
    };

    /**
     * Enum for node operations.
     * @enum {number}
     */
    const NodeMethod = {
      PREPEND: 0,
      APPEND: 1,
      BEFORE: 2,
      AFTER: 3,
      REPLACE: 4
    };

    /**
     * Enum for class name operations.
     * @enum {string}
     */
    const ClassListMethod = {
        ADD: "add",
        REMOVE: "remove",
        TOGGLE: "toggle"
    };

    /**
     * Enum for node relatives.
     * @enum {string}
     */
    const Relative = {
        PARENT_ELEMENT: "parentElement",
        FIRST_ELEMENT_CHILD: "firstElementChild",
        LAST_ELEMENT_CHILD: "lastElementChild"
    };

    /**
     * Turn CSS property names into their JS counterparts (eg. margin-top --> marginTop)
     * @private
     * @param  {string} property CSS property name
     * @return {string} JS property name
     */
    function kebabToCamel (property) {
        return property.replace(/-([a-z])/g, (nothing, match) => match.toUpperCase());
    };

    /**
     * Check if a reference is undefined
     * @private
     * @param  {*}  reference
     * @return {boolean} The undefinedness of the reference
     */
    function isUndefined (reference) {
        return reference === undefined;
    };

    /**
     * Check if a reference is a String
     * @private
     * @param  {*}  reference
     * @return {boolean} The stringness of the reference
     */
    function isString (reference) {
        return typeof reference === "string";
    };

    /**
     * Add, remove, or toggle class names
     * @private
     * @param {Jamon} context The Jamón instance
     * @param {string} className Space-separated class names
     * @param {ClassListMethod} method Method to use on the class name(s)
     * @return {Jamon}
     */
    function addRemoveToggleClass (context, className, method) {
        if (isUndefined(className)) {
            throw new ReferenceError(`Invalid parameter: ${className}`);
        }

        if (!isString(className)) {
            throw new TypeError(`Parameter must be a String`);
        }
        // Split by spaces, then remove empty elements caused by extra whitespace
        const classNames = className.split(" ").filter(item => item.length);

        if (classNames.length) {
            for (const element of context) {
                if (method !== ClassListMethod.TOGGLE) {
                    // add and remove accept multiple parameters…
                    element.classList[method](...classNames);
                } else {
                    // while toggle accepts only one
                    for (const className of classNames) {
                        element.classList.toggle(className);
                    }
                }
            }
        }

        return context;
    };

    /**
     * Get & set element properties
     * @private
     * @param  {Jamon} context The Jamón instance
     * @param  {string} property Property name
     * @param  {*} value Property value
     * @return {Jamon}
     */
    function getSetProperty (context, property, value) {
        if (isUndefined(value)) {
            return context[0][property];
        }

        for (const element of context) {
            element[property] = value;
        }

        return context;
    };

    /**
     * Get relatives of the element
     * @private
     * @param  {Jamon} context
     * @param  {Relative} relative
     * @return {Jamon} New Jamón instance containing the found elements
     */
    function getRelative (context, relative) {
        const relatives = [];

        for (const element of context) {
            relatives.push(element[relative]);
        }

        return Jamon.from(relatives);
    };

    // Handle all node insertion operations
    /**
     * Handle all node insertion operations
     * @private
     * @param  {Jamon|string} subject The element/string that we are using
     * @param  {string|Element|Text|Document|Jamon} target The target we are using the subject with
     * @param  {NodeMethod} operation Name of the operation
     * @param  {number} contextIndex Index of the paramater to be returned
     * @return {Jamon} The Jamón instance (referenced by contextIndex)
     * @todo   Separate this monster into 4 parts
     */
    function insertNode (subject, target, operation, contextIndex) {
        // make sure target is a Jamon instance
        target = target instanceof Jamon ? target : Jamon.$(target);

        const lastIndex = target.length - 1;
        let index = 0,
            subjectIsText = false;

        // make sure the subject is an element
        if (isString(subject)) {
            // insert string as textNode
            subject = document.createTextNode(subject);
            subjectIsText = true;
        } else {
            subject = Jamon.$(subject)[0];
        }

        if (operation === NodeMethod.BEFORE || operation === NodeMethod.AFTER) {
            // before, insertBefore, after, insertAfter
            for (const element of target) {
                // use a clone of the subject for all but the last target
                element.parentElement.insertBefore(
                    (index++ < lastIndex) ? subject.cloneNode(true) : subject,
                    operation === NodeMethod.BEFORE ? element : element.nextSibling
                );
                // remove adjacent textNodes
                if (subjectIsText && element.parentNode) {
                    element.parentNode.normalize();
                }
            }
        } else if (operation === NodeMethod.PREPEND) {
            // prepend, prependTo
            for (const element of target) {
                // use a clone of the subject for all but the last target
                element.insertBefore(
                    (index++ < lastIndex) ? subject.cloneNode(true) : subject,
                    element.firstChild
                );
                // remove adjacent textNodes
                if (subjectIsText) {
                    element.normalize();
                }
            }
        } else if (operation === NodeMethod.APPEND) {
            // append, appendTo
            for (const element of target) {
                // use a clone of the subject for all but the last target
                element.appendChild((index < lastIndex) ? subject.cloneNode(true) : subject);
                // remove adjacent textNodes
                if (subjectIsText) {
                    element.normalize();
                }
            }
        } else if (operation === NodeMethod.REPLACE) {
            // replace, replaceWith
            for (const element of target) {
                // use a clone of the subject for all but the last target
                element.parentElement.replaceChild(
                    index < lastIndex ? subject.cloneNode(true) : subject,
                    element
                );
                // remove adjacent textNodes
                if (subjectIsText) {
                    subject.parentNode.normalize();
                }
            }
        }
        // return the subject or the target (whichever contextIndex points to)
        return arguments[contextIndex];
    };

    /**
     * Generate a unique proxy id for the given listener-selector combination
     * @private
     * @param  {function(Event)} listener The event listener function
     * @param  {string} selector The selector used for the delegation
     * @return {string} Unique proxy id
     */
    function getProxyId (listener, selector) {
        // The proxy id consists of the unique index attached the function and the selector string
        return `${listener[listenerProperty]}|${selector}`;
    };

    /**
     * Runs querySelectorAll WITHIN the element (unlike native qSA)
     * @private
     * @param  {HTMLElement} element The search context
     * @param  {string} selector The selector to use in the query
     * @param  {boolean=} one Do we want only one result?
     * @return {HTMLElement|NodeList} The result of the query
     */
    function findInElement (element, selector, one) {
        let result,
            temporaryId = false,
            id = element.id;
        const method = one ? "querySelector" : "querySelectorAll";

        // Assign temporary ID if not present
        if (!id) {
            temporaryId = true;
            id = `jamon-temporary-id`;
            element.id = id;
        }

        // Prepend selector with the element's ID
        selector = `#${id} ${selector}`;
        // Get the results
        result = element[method](selector);

        // Remove temporary ID
        if (temporaryId) {
            element.removeAttribute("id");
        }

        // Return the result
        return result;
    };

    /**
     * Jamón class definition
     * @extends {Array}
     */
    class Jamon extends Array {

        /**
         * Create a new element
         * @param  {string} type - Element type
         * @param  {Object=} attributes - Attributes
         * @return {Jamon} The element wrapped in a Jamón instance
         */
        static create (type, attributes) {
            const element = document.createElement(type);
            if (attributes) {
                for (const attribute of Object.keys(attributes)) {
                    element.setAttribute(attribute, attributes[attribute]);
                }
            }
            return Jamon.from([element]);
        }

        /**
         * Sets the class name used for hide(), show(), and toggle()
         * @param {string} className - The new class name to use
         */
        static setHiddenClassName (className) {
            if (isString(className) && className.length) {
                hiddenClassName = className;
            }
        }

        /**
         * Get a single element
         * @param  {string|HTMLElement|Text|HTMLDocument|Jamon} selector
         * @return {Jamon} New Jamón instance
         */
        static $ (selector) {
            let result;
            if (isUndefined(selector)) {
                // empty collection
                result = Jamon.from([]);
            } else if (isString(selector)) {
                // selector
                let element = document.querySelector(selector);
                // Array.from cannot use undefined or null
                element = element ? [element] : [];
                result = Jamon.from(element);
            } else if ([Node.ELEMENT_NODE, Node.DOCUMENT_NODE, Node.TEXT_NODE].includes(selector.nodeType)) {
                // element node, text node, or document node
                result = Jamon.from([selector]);
            } else if (selector instanceof Jamon) {
                // Jamon instance
                result = selector;
            }

            return result;
        }

        /**
         * Get multiple elements
         * @param  {string|NodeList|HTMLCollection|Jamon} selector
         * @return {Jamon} New Jamón instance
         */
        static $$ (selector) {
            let result;
            if (isUndefined(selector)) {
                // empty collection
                result = Jamon.from([]);
            } else if (isString(selector)) {
                // selector string
                result = Jamon.from(document.querySelectorAll(selector));
            } else if (selector instanceof Jamon) {
                // Jamon instance
                result = selector;
            } else if (selector.constructor === NodeList || selector.constructor === HTMLCollection) {
                // NodeList or HTMLCollection
                result = Jamon.from(selector);
            }

            return result;
        }

        // Find the first descendant that matches the selector in any of the elements
        findOne (selector) {
            let result;
            for (const element of this) {
                result = findInElement(element, selector, true);
                if (result) {
                    return Jamon.from([result]);
                }
            }
        }

        // Find all descendants that match the selector within each element
        findAll (selector) {
            let results = [];
            for (const element of this) {
                results = results.concat(Array.from(findInElement(element, selector)));
            }
            return Jamon.from(new Set(results));
        }

        // Filter the elements (returns a new Jamón instance)
        filterBy (selector) {
            const elements = this.filter((element) => element.matches(selector));
            return Jamon.from(elements);
        }

        /**
         * Add class name(s)
         * @param {string} className - Space-separated class names
         * @return {Jamon} The instance
         */
        addClass (className) {
            return addRemoveToggleClass(this, className,ClassListMethod.ADD);
        }

        /**
         * Remove class name(s)
         * @param  {string} className - Space-separated class names
         * @return {Jamon} The instance
         */
        removeClass (className) {
            return addRemoveToggleClass(this, className, ClassListMethod.REMOVE);
        }

        /**
         * Toggle class name(s)
         * @param  {string} className - Space-separated class names
         * @return {Jamon} The instance
         */
        toggleClass (className) {
            return addRemoveToggleClass(this, className, ClassListMethod.TOGGLE);
        }

        // Checks if the element has the provided class name
        hasClass (className) {
            return this[0].classList.contains(className);
        }

        // Show the element
        show () {
            return this.removeClass(hiddenClassName);
        }

        // Hide the element
        hide () {
            return this.addClass(hiddenClassName);
        }

        // Toggle the visibility of the element
        toggle () {
            return this.toggleClass(hiddenClassName);
        }

        // Get or set value
        val (value) {
            return getSetProperty(this, "value", value);
        }

        // Get or set HTML content
        html (html) {
            return getSetProperty(this, "innerHTML", html);
        }

        // Get or set text content
        text (text) {
            return getSetProperty(this, "textContent", text);
        }

        // Get or set property
        prop (property, value) {
            return getSetProperty(this, property, value);
        }

        // Remove property
        removeProp (property) {
            return getSetProperty(this, property, null);
        }

        // Get or set attributes
        attr (attribute, value) {
            if (isUndefined(value)) { // get
                return this[0].getAttribute(attribute);
            }

            for (const element of this) { // set
                element.setAttribute(attribute, value);
            }

            return this;
        }

        // Remove attribute
        removeAttr (attribute) {
            for (const element of this) {
                element.removeAttribute(attribute);
            }

            return this;
        }

        // Get or set inline styles
        css (style, value) {
            if (isString(style)) {
                // set single style
                if (!isUndefined(value)) {
                    for (const element of this) {
                        element.style[kebabToCamel(style)] = value;
                    }
                    return this;
                // get style
                } else {
                    const property = kebabToCamel(style);
                    value = window.getComputedStyle(this[0])[property];
                    return cssNumberProperties.has(property) ? value : parseFloat(value);
                }
            // set multiple styles
            } else if (typeof style === "object") {
                const normalizedStyles = new Map();
                Object.keys(style).forEach((property) => {
                    const value = style[property];
                    normalizedStyles.set(kebabToCamel(property),value);
                });

                for (const element of this) {
                    for (const normalizedStyle of normalizedStyles) {
                        element.style[normalizedStyle[0]] = normalizedStyle[1];
                    }
                }

                return this;
            }
        }

        // Get or set data attributes
        data (attribute, value) {
            if (isUndefined(value)) { // get
                const element = this[0],
                    storage = dataMap.get(element);
                let data;
                // look it up in the storage first, then in the data-attribute
                if (storage && (!isUndefined(storage.get(attribute)))) {
                    data = storage.get(attribute);
                } else {
                    data = element.dataset[attribute];
                }

                return data;
            }

            for (const element of this) {
                dataMap.set(element,(dataMap.get(element) || new Map()).set(attribute, value));
            }

            return this;
        }

        // Get width
        width () {
            return this[0].getBoundingClientRect().height;
        }

        // Get height
        height () {
            return this[0].getBoundingClientRect().width;
        }

        // Get scroll width
        scrollWidth () {
            return this[0].scrollWidth;
        }

        //Get scroll height
        scrollHeight () {
            return this[0].scrollHeight;
        }

        // Get position relative to the parent
        offset () {
            const element = this[0];
            return {
                left: element.offsetLeft,
                top: element.offsetTop
            };
        }

        // Get or set position relative to the document
        position (position) {
            const rect = this[0].getBoundingClientRect();
            if (!position) {
                return {
                    left: rect.left,
                    top: rect.top
                };
            }

            for (const element of this) {
                const offsetParent = element.offsetParent || document.body,
                    parentRect = offsetParent.getBoundingClientRect(),
                    computedStyle = window.getComputedStyle(element),
                    style = element.style,
                    left = position.left,
                    top = position.top;

                let originalLeft, originalTop;

                if (computedStyle.position === "static") {
                    // get the offset position
                    originalLeft = element.offsetLeft;
                    originalTop = element.offsetTop;
                    // set position to relative so the page doesn't reflow
                    style.position = "relative";
                } else {
                    // get the original position of relative positioned elements
                    originalLeft = element.offsetLeft - (parseFloat(computedStyle.left) || 0);
                    originalTop = element.offsetTop - (parseFloat(computedStyle.top) || 0);
                }

                // subtract the offsets of the element and its parent to get the absolute position
                if (!isUndefined(left)) {
                    style.left = left - originalLeft - parentRect.left + "px";
                }

                if (!isUndefined(top)) {
                    style.top = top - originalTop - parentRect.top + "px";
                }
            }
        }

        // Get or set horizontal scroll position
        scrollLeft (value) {
            return getSetProperty(this, "scrollLeft", value);
        }

        // Get or set vertical scroll position
        scrollTop (value) {
            return getSetProperty(this, "scrollTop", value);
        }

        // Get the parent of the element
        parent () {
            return getRelative(this, Relative.PARENT_ELEMENT);
        }

        // Get the first child of the element
        firstChild () {
            return getRelative(this, Relative.FIRST_ELEMENT_CHILD);
        }

        // Get the last child of the element
        lastChild () {
            return getRelative(this, Relative.LAST_ELEMENT_CHILD);
        }

        // Get the children of the element
        children () {
            const children = [];

            for (const element of this) {
                children.push(...Array.from(element.children));
            }

            return new Jamon(children);
        }

        contents () {
            const contents = [];
            for (const element of this) {
                contents.push(...Array.from(element.childNodes));
            }

            return new Jamon(contents);
        }

        // Get the first ancestor that matches the selector
        closest (selector) {
            const closests = [];

            for (const element of this) {
                closests.push(element.closest(selector));
            }

            return new Jamon(closests);
        }

        // Prepend something to the element
        prepend (subject) {
            return insertNode(subject, this, NodeMethod.PREPEND, 1);
        }

        // Prepend the element to something
        prependTo (target) {
            return insertNode(this, target, NodeMethod.PREPEND, 0);
        }

        // Append something to the element
        append (subject) {
            return insertNode(subject, this, NodeMethod.APPEND, 1);
        }

        // Append the element to something
        appendTo (target) {
            return insertNode(this, target, NodeMethod.APPEND, 0);
        }

        // Insert something before the element
        before (subject) {
            return insertNode(subject, this, NodeMethod.BEFORE, 1);
        }

        // Insert the element before something
        insertBefore (target) {
            return insertNode(this, target, NodeMethod.BEFORE, 0);
        }

        // Insert something after the element
        after (subject) {
            return insertNode(subject, this, NodeMethod.AFTER, 1);
        }

        // Insert the element after something
        insertAfter (target) {
            return insertNode(this, target, NodeMethod.AFTER, 0);
        }

        // Replace the element with something
        replaceWith (subject) {
            return insertNode(subject, this, NodeMethod.REPLACE, 1);
        }

        // Replace something with the element
        replaceAll (target) {
            return insertNode(this, target, NodeMethod.REPLACE, 0);
        }

        // Clone the element
        clone (deep) {
            const clones = [];

            for (const element of this) {
                clones.push(element.cloneNode(deep));
            }

            return new Jamon(clones);
        }

        // Remove the element from the DOM
        remove () {
            for (const element of this) {
                element.remove();
                element.parentNode.normalize(); // remove adjacent textNodes
            }

            return this;
        }

        // Add event listener
        on (events, listener) {
            events = events.split(" ");

            for (const event of events) {
                for (const element of this) {
                    element.addEventListener(event, listener);
                }
            }

            return this;
        }

        // Remove event listener
        off (events, selector, listener) {
            events = events.split(" ");

            // delegated event, get the stored proxy
            if (listener) {
                listener = proxyMap.get(getProxyId(listener, selector));
            // basic listener
            } else {
                listener = selector;
            }

            for (const event of events) {
                for (const element of this) {
                    element.removeEventListener(event, listener);
                }
            }

            return this;
        }

        // Delegates an event
        delegate (event, selector, listener) {
            const proxy = function (e) {
                const target = e.target;
                if (target.matches(selector)) {
                    listener.call(target, e);
                }
            };
            // assign a unique ID to proxied listeners
            if (!listener[listenerProperty]) {
                listener[listenerProperty] = listenerIndex++;
            }
            // store the proxy so we can remove it later
            proxyMap.set(getProxyId(listener, selector), proxy);

            return this.on(event, proxy);
        }

        // Trigger event on the element
        trigger (event, detail) {
            let type = "Event",
                bubbles = false,
                cancelable = false;

            // Set up event properties based on event type
            if (!isUndefined(detail)) {
                type = "CustomEvent";
            } else if (EventRegExp.MOUSE.test(event)) {
                type = "MouseEvent";
                bubbles = true;
                cancelable = true;
            } else if (EventRegExp.FOCUS.test(event)) {
                type = "FocusEvent";
                if (event === "change") {
                    bubbles = true;
                }
            } else if (EventRegExp.FORM.test(event)) {
                bubbles = true;
                cancelable = true;
            } else if (EventRegExp.KEYBOARD.test(event)) {
                   type = "KeyboardEvent";
                   bubbles = true;
                   cancelable = true;
            } else if (EventRegExp.TOUCH.test(event)) {
                type = "TouchEvent";
                bubbles = true;

                if (event !== "touchcancel") {
                    cancelable = true;
                }
            } else if (EventRegExp.POINTER.test(event)) {
                let exceptions = ["pointerenter", "pointerleave"];
                type = "PointerEvent";
                if (!exceptions.includes(event)) {
                    bubbles = true;
                }
                exceptions.push("pointercancel");
                if (!exceptions.includes(event)) {
                    cancelable = true;
                }
            }

            for (const element of this) {
                element.dispatchEvent(new window[type](event, {bubbles, cancelable, detail}));
            }

            return this;
        }
    }

    // Assign global variables
    window.Jamon = Jamon;
    if (isUndefined(window.$) && isUndefined(window.$$)) {
        window.$ = Jamon.$;
        window.$$ = Jamon.$$;
    }
}
