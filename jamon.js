/*
 *  Copyright (c) 2016 Viktor Honti
 *  Licensed under the MIT License.
 *  https://github.com/jamonserrano/jamon
 */

// TODO clean up attr and prop => get, set
// TODO store all listeners and remove them with remove()
"use strict";
{
    // event listener index
    let listenerIndex = 1;

    // class name used for hiding elements - can be overriden
    let hiddenClassName = "hidden";

    // event listener property name
    const listenerProperty = Symbol("listenerProperty");

    // CSS properties that accept numbers (to know when to not append "px"), list taken from jQuery
    const cssNumberProperties = new Set(["columnCount", "fillOpacity", "fontWeight",
        "lineHeight", "opacity", "order", "orphans", "widows", "zIndex","zoom"]);

    // element data storage
    const dataMap = new WeakMap();

    // event listener proxy storage
    const proxyMap = new Map();

    // save current $ for no conflict mode
    const previou$ = window.$;
    const previou$$ = window.$$;

    // Get a single element
    const jamon = function (selector, context) {
        // selector string
        if (typeof selector === "string") {
            const element = (context || document).querySelector(selector);
            return element ? new Jamon([element]) : new Jamon([]);
        // elementNode, textNode, or documentNode
        } else if ([Node.ELEMENT_NODE, Node.DOCUMENT_NODE, Node.TEXT_NODE].includes(selector.nodeType)) {
            return new Jamon([selector]);
        // Jamon instance
        } else if (selector.isJamon) {
            return selector;
        }
    };

    // Get multiple elements
    const jamones = function (selector, context) {
        // selector string
        if (typeof selector === "string") {
            return new Jamon((context || document).querySelectorAll(selector));
        // Jamon instance
        } else if (selector.isJamon) {
            return selector;
        // NodeList or HTMLCollection
        } else if (selector.constructor === NodeList || selector.constructor === HTMLCollection) {
            return new Jamon(selector);
        }
    };

    // Turn CSS property names into their JS counterparts (eg. margin-top --> marginTop)
    const kebabToCamel = function (text) {
        return text.replace(/-([a-z])/g, (_, match) => match.toUpperCase());
    };

    const defined = function (variable) {
        return variable !== undefined;
    };

    // Get & set properties
    const getSetProperty = function (context, property, value) {
        if (defined(value)) {
            return context.element[property];
        }

        for (const element of context) {
            element[property] = value;
        }

        return context;
    };

    // Get relatives of the element
    const getRelative = function (context, relative) {
        const relatives = [];

        for (const element of context) {
            relatives.push(element[relative]);
        }

        return new Jamon(relatives);
    };

    // Handle all node insertion operations
    const insertNode = function (subject, target, operation, thisArg) {
        // make sure target is a Jamon instance
        target = target.isJamon ? target : jamon(target);

        const lastIndex = target.length - 1;
        let index = 0,
            subjectIsText = false;

        // make sure the subject is an element
        if (typeof subject === "string") { // insert string as textNode
            subject = document.createTextNode(subject);
            subjectIsText = true;
        } else {
            subject = jamon(subject).element;
        }

        // before, insertBefore, after, insertAfter
        if (operation === "before" || operation === "after") {
            for (const element of target) {
                element.parentElement.insertBefore(
                    (index++ < lastIndex) ? subject.cloneNode(true) : subject, // clone
                    operation === "before" ? element : element.nextSibling
                );
                // remove adjacent textNodes
                if (subjectIsText && element.parentNode) {
                    element.parentNode.normalize();
                }
            }
        // prepend, prependTo
        } else if (operation === "prepend") {
            for (const element of target) {
                element.insertBefore(
                    (index++ < lastIndex) ? subject.cloneNode(true) : subject,  // clone subject
                    element.firstChild
                );
                // remove adjacent textNodes
                if (subjectIsText) {
                    element.normalize();
                }
            }
        // append, appendTo
        } else if (operation === "append") {
            for (const element of target) {
                element.appendChild((index < lastIndex) ? subject.cloneNode(true) : subject); // clone subject
                // remove adjacent textNodes
                if (subjectIsText) {
                    element.normalize();
                }
            }
        // replace, replaceWith
        } else if (operation === "replace") {
            for (const element of target) {
                element.parentElement.replaceChild(
                    index < lastIndex ? subject.cloneNode(true) : subject, // clone subject
                    element
                );
                // remove adjacent textNodes
                if (subjectIsText) {
                    subject.parentNode.normalize();
                }
            }
        }
        return arguments[thisArg];
    };

    // Get the proxyID for the given listener-selector combination
    const getProxyId = function (listener, selector) {
        return `${listener[listenerProperty]}|${selector}`;
    };

    // base class
    const Jamon = function (elements) {
        // element list
        this.elements = Array.from(elements);
    };

    Jamon.prototype = {
        // proof that this is a Jamon instance
        isJamon: true,

        // Read-only length property
        get length () {
            return this.elements.length;
        },

        // Read-only element property
        get element () {
            return this.elements[0];
        },

        // provide for...of iteration on the instance
        [Symbol.iterator] () {
            const elements = this.elements,
                length = elements.length;
            let index = 0;

            return {
                next () {
                    if (index < length) {
                        return {value: elements[index++]};
                    } else {
                        return {done: true};
                    }
                }
            };
        },

        // provide forEach iteration on the instance
        forEach (callback) {
            let index = 0;

            for (const element of this) {
                callback.call(null, element, index++);
            }
        },

        // Add class name(s)
        addClass (className) {
            for (const element of this) {
                element.classList.add(...className.split(" "));
            }

            return this;
        },

        // Remove class name(s)
        removeClass (className) {
            for (const element of this) {
                const classList = element.classList;
                classList.remove(...className.split(" "));
            }

            return this;
        },

        // Toggle class name(s)
        toggleClass (className) {
            const classNames = className.split(" ");

            for (const element of this) {
                for (const className of classNames) {
                    element.classList.toggle(className);
                }
            }

            return this;
        },

        // Show the element
        show () {
            return this.removeClass(hiddenClassName);
        },

        // Hide the element
        hide () {
            return this.addClass(hiddenClassName);
        },

        // Toggle the visibility of the element
        toggle () {
            return this.toggleClass(hiddenClassName);
        },

        // Get or set value
        val (value) {
            return getSetProperty(this, "value", value);
        },

        // Get or set HTML content
        html (html) {
            return getSetProperty(this, "innerHTML", html);
        },

        // Get or set text content
        text (text) {
            return getSetProperty(this, "textContent", text);
        },

        // Get or set property
        prop (property, value) {
            return getSetProperty(this, property, value);
        },

        // Remove property
        removeProp (property) {
            return getSetProperty(this, property, null);
        },

        // Get or set attributes
        attr (attribute, value) {
            if (defined(value)) { // get
                return this.element.getAttribute(attribute);
            }

            for (const element of this) { // set
                element.setAttribute(attribute, value);
            }

            return this;
        },

        // Remove attribute
        removeAttr (attribute) {
            for (const element of this) {
                element.removeAttribute(attribute);
            }

            return this;
        },

        // Get or set inline styles
        css (style, value) {
            if (typeof style === "string") {
                // set single style
                if (defined(value)) {
                    for (const element of this) {
                        element.style[kebabToCamel(style)] = value;
                    }
                    return this;
                // get style
                } else {
                    const property = kebabToCamel(style);
                    value = window.getComputedStyle(this.element)[property];
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
        },

        // Get or set data attributes
        data (attribute, value) {
            if (defined(value)) { // get
                const element = this.element,
                    storage = dataMap.get(element);
                let data;
                // look it up in the storage first, then in the data-attribute
                if (storage && (defined(storage.get(attribute)))) {
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
        },

        // Get width
        width () {
            return this.element.getBoundingClientRect().height;
        },

        // Get height
        height () {
            return this.element.getBoundingClientRect().width;
        },

        // Get scroll width
        scrollWidth () {
            return this.element.scrollWidth;
        },

        //Get scroll height
        scrollHeight () {
            return this.element.scrollHeight;
        },

        // Get position relative to the parent
        offset () {
            const element = this.element;
            return {
                left: element.offsetLeft,
                top: element.offsetTop
            };
        },

        // Get or set position relative to the document
        position (position) {
            const rect = this.element.getBoundingClientRect();
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
                if (defined(left)) {
                    style.left = left - originalLeft - parentRect.left + "px";
                }

                if (defined(top)) {
                    style.top = top - originalTop - parentRect.top + "px";
                }
            }
        },

        // Get or set horizontal scroll position
        scrollLeft (value) {
            return getSetProperty(this, "scrollLeft", value);
        },

        // Get or set vertical scroll position
        scrollTop (value) {
            return getSetProperty(this, "scrollTop", value);
        },

        // Get the parent of the element
        parent () {
            return getRelative(this, "parentElement");
        },

        // Get the first child of the element
        firstChild () {
            return getRelative(this, "firstElementChild");
        },

        // Get the last child of the element
        lastChild () {
            return getRelative(this, "lastElementChild");
        },

        // Get the children of the element
        children () {
            const children = [];

            for (const element of this) {
                children.push(...Array.from(element.children));
            }

            return new Jamon(children);
        },

        contents () {
            const contents = [];
            for (const element of this) {
                contents.push(...Array.from(element.childNodes));
            }

            return new Jamon(contents);
        },

        // Get the first ancestor that matches the selector
        closest (selector) {
            const closests = [];

            for (const element of this) {
                closests.push(element.closest(selector));
            }

            return new Jamon(closests);
        },

        // Prepend something to the element
        prepend (subject) {
            return insertNode(subject, this, "prepend", 1);
        },

        // Prepend the element to something
        prependTo (target) {
            return insertNode(this, target, "prepend", 0);
        },

        // Append something to the element
        append (subject) {
            return insertNode(subject, this, "append", 1);
        },

        // Append the element to something
        appendTo (target) {
            return insertNode(this, target, "append", 0);
        },

        // Insert something before the element
        before (subject) {
            return insertNode(subject, this, "before", 1);
        },

        // Insert the element before something
        insertBefore (target) {
            return insertNode(this, target, "before", 0);
        },

        // Insert something after the element
        after (subject) {
            return insertNode(subject, this, "after", 1);
        },

        // Insert the element after something
        insertAfter (target) {
            return insertNode(this, target, "after", 0);
        },

        // Replace the element with something
        replaceWith (subject) {
            return insertNode(subject, this, "replace", 1);
        },

        // Replace something with the element
        replaceAll (target) {
            return insertNode(this, target, "replace", 0);
        },

        // Clone the element
        clone (deep) {
            const clones = [];

            for (const element of this) {
                clones.push(element.cloneNode(deep));
            }

            return new Jamon(clones);
        },

        // Remove the element from the DOM
        remove () {
            for (const element of this) {
                element.remove();
                element.parentNode.normalize(); // remove adjacent textNodes
            }

            return this;
        },

        // Add event listener
        on (events, listener) {
            events = events.split(" ");

            for (const event of events) {
                for (const element of this) {
                    element.addEventListener(event, listener);
                }
            }

            return this;
        },

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
        },

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
        },

        // Trigger event on the element
        trigger (event, detail) {
            let type = "Event",
                bubbles = false,
                cancelable = false;

            if (defined(detail)) {
                type = "CustomEvent";
            } else if (["click", "dblclick", "contextmenu"].includes(event) || event.startsWith("mouse")) {
                type = "MouseEvent";
                bubbles = true;
                cancelable = true;
            } else if (["blur", "change", "focus"].includes(event)) {
                type = "FocusEvent";
                if (event === "change") {
                    bubbles = true;
                }
            } else if (event.startsWith("key")) {
                type = "KeyboardEvent";
                bubbles = true;
                cancelable = true;
            }

            for (const element of this) {
                element.dispatchEvent(new window[type](event, {bubbles, cancelable, detail}));
            }

            return this;
        }
    };

    // Utility: do something when the document is ready
    jamon.ready = function () {
        return new Promise(function (resolve) {
            if (document.readyState === "ready") {
                resolve();
            } else {
                document.addEventListener("DOMContentLoaded", resolve);
            }
        });
    };

    // Utility: create a new element
    jamon.create = function (type, options) {
        const element = document.createElement(type);
        if (options) {
            for (const key of Object.keys(options)) {
                element.setAttribute(key, options[key]);
            }
        }
        return new Jamon([element]);
    };

    // Utility: no conflict mode, jQuery style: reset & release globals $ and $$.
    jamon.noConflict = function () {
        if (window.$ === jamon) {
            window.$ = previou$;
        }
        if (window.$$ === jamones) {
            window.$$ = previou$$;
        }
        return [jamon, jamones];
    };

    // Utility: add a method to the Jamon prototype
    jamon.extend = function (name, func) {
        Jamon.prototype[name] = func;
    };

    // Utility: set hidden class name (used in show, hide, and toggle)
    jamon.setHiddenClassName = function (className) {
        if (typeof className === "string") {
            hiddenClassName = className;
        }
    };

    // Assign global variables
    window.$ = window.jamon = jamon;
    window.$$ = jamon.es = jamones;
}
