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
	 * @const
	 * @type {symbol}
	 */
	const listenerID = Symbol("listenerID");

	/**
	 * Storage for proxied event listeners
	 * @private
	 * @const
	 * @type {Map}
	 */
	const proxyMap = new Map();

	/**
	 * Regular expressions to indentify event types
	 * @private
	 * @const
	 * @enum {RegExp}
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
	 * @private
	 * @const
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
	 * @private
	 * @const
	 * @enum {string}
	 */
	const ClassListMethod = {
		ADD: "add",
		REMOVE: "remove",
		TOGGLE: "toggle"
	};

	/**
	 * Cross-browser 'matches' method
	 * @private
	 * @const
	 * @type {string}
	 * @todo remove when Edge implements 'matches'
	 */
	const matchMethod = Element.prototype.msMatchesSelector ? "msMatchesSelector" : "matches";

	/**
	 * Turn CSS property names into their JS counterparts (eg. margin-top --> marginTop)
	 * @private
	 * @param  {string} property - CSS property name
	 * @return {string}		     - JS property name
	 */
	function camelCase (property) {
		return property.replace(/-([a-z])/g, (nothing, match) => match.toUpperCase());
	}
	
	/**
	 * Turn JS property names into their CSS counterparts (eg. marginTop --> margin-top)
	 * @private
	 * @param  {string} property - JS property name
	 * @return {string}		     - CSS property name
	 */
	function kebabCase (property) {
		return property.replace(/([A-Z])/g, (match) => "-" + match.toLowerCase());
	}

	/**
	 * Check if a reference is undefined
	 * @private
	 * @param  {*} reference - The reference to check
	 * @return {boolean}	 - The undefinedness of the reference
	 */
	function isUndefined (reference) {
		return typeof reference === "undefined";
	}

	/**
	 * Check if a reference is a String
	 * @private
	 * @param  {*} reference - The reference to check
	 * @return {boolean}	 - The stringness of the reference
	 */
	function isString (reference) {
		return typeof reference === "string";
	}

	/**
	 * Add, remove, or toggle class names
	 * @private
	 * @param {Jamon} context		  - The Jamón instance
	 * @param {string} className	   - Space-separated class names
	 * @param {ClassListMethod} method - Method to use on the class name(s)
	 * @return {Jamon}
	 */
	function addRemoveToggleClass (context, className, method) {
		if (isUndefined(className)) {
			throw new ReferenceError();
		}

		if (!isString(className)) {
			throw new TypeError();
		}

		// Split by spaces, then remove empty elements caused by extra whitespace
		const classNames = className.split(" ").filter(item => item.length);

		if (classNames.length) {
			for (const element of context) {
				if (method !== ClassListMethod.TOGGLE) {
					// 'add' and 'remove' accept multiple parameters…
					element.classList[method](...classNames);
				} else {
					// while 'toggle' accepts only one
					for (const className of classNames) {
						element.classList.toggle(className);
					}
				}
			}
		}

		return context;
	}
	
	/**
	 * Get & set element properties
	 * @private
	 * @param  {Jamon} collection			 - The Jamón instance
	 * @param  {string} property			 - Property name
	 * @param  {string|null|undefined} value - Property value (null to remove property)
	 * @return {Jamon}
	 */
	function getSetRemoveProperty (collection, property, value) {
		if (isUndefined(value)) {
			// get property of first element if there is one
			return collection[0] ? collection[0][property] : undefined;
		} else if (value !== null) {
			for (const element of collection) {
				element[property] = value;
			}
		} else {
			for (const element of collection) {
				delete element[property];
			}
		}

		return collection;
	}

	/**
	 * Handle all node insertion operations
	 * @private
	 * @param  {Jamon|string} subject					  - The element/string that we are using
	 * @param  {Jamon} target							  - The target we are using the subject with
	 * @param  {NodeMethod} operation					  - Name of the operation
	 * @param  {number} contextIndex					   - Index of the paramater to be returned
	 * @return {Jamon}									 - The Jamón instance (referenced by contextIndex)
	 * @todo   Separate this monster into 4 parts
	 * @todo   Support multiple subjects
	 */
	function insertNode (subject, target, operation, contextIndex) {
		// make sure subject is Jamon instance or string
		if (!subject instanceof Jamon && !isString(subject)) {
			throw new TypeError();
		}
		
		// make sure target is Jamon instance
		if (!target instanceof Jamon) {
			throw new TypeError();	
		}
		
		let subjectIsText = false;

		if (isString(subject)) {
			// if the subject is string, convert it into text node so we can insert it
			subject = document.createTextNode(subject);
			subjectIsText = true;
		} else {
			// only use the first element
			subject = subject[0];
		}
		
		target = target[0];

		if (operation === NodeMethod.BEFORE || operation === NodeMethod.AFTER) {
			// before(), insertBefore(), after(), insertAfter()
				target.parentElement.insertBefore(subject, operation === NodeMethod.BEFORE ? target : target.nextSibling);
				// remove adjacent textNodes
				if (subjectIsText && target.parentNode) {
					target.parentNode.normalize();
				}
		} else if (operation === NodeMethod.PREPEND) {
			// prepend(), prependTo()
				target.insertBefore(subject, target.firstChild);
				// remove adjacent textNodes
				if (subjectIsText) {
					target.normalize();
				}
		} else if (operation === NodeMethod.APPEND) {
			// append(), appendTo()
			target.appendChild(subject);
				// remove adjacent textNodes
				if (subjectIsText) {
					target.normalize();
				}
		} else if (operation === NodeMethod.REPLACE) {
			// replace(), replaceWith()
			target.parentElement.replaceChild(subject, target);
				// remove adjacent textNodes
				if (subjectIsText) {
					subject.parentNode.normalize();
				}
		}
		
		// return the subject or the target (whichever contextIndex points to)
		return arguments[contextIndex];
	}

	/**
	 * Generate a unique proxy id for the given listener-selector combination
	 * @private
	 * @param  {function(Event)} listener - The event listener function
	 * @param  {string} selector		  - The selector used for the delegation
	 * @return {string}				   - Unique proxy id
	 */
	function getProxyId (listener, selector) {
		// The proxy id consists of the unique index attached the function and the selector string
		return `${listener[listenerID]}|${selector}`;
	}

	/**
	 * Runs querySelectorAll WITHIN the element (unlike native qSA)
	 * @private
	 * @param  {HTMLElement} element  - The search context
	 * @param  {string} selector	  - The selector to use in the query
	 * @param  {boolean=} one		 - Do we want only one result?
	 * @return {HTMLElement|NodeList} - The result of the query
	 */
	function findInElement (element, selector, one) {
		let result,
			temporaryId = false,
			id = element.id;
		const method = one ? "querySelector" : "querySelectorAll";

		// Assign temporary ID if not present
		if (!id) {
			temporaryId = true;
			id = "jamon-temporary-id";
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
	}

	/**
	 * Jamón class definition
	 * @extends {Array}
	 * @unrestricted
	 */
	class Jamon extends Array {
		
		/**
		 * Create a new element
		 * @param  {string} type		- Element type
		 * @param  {Object=} properties - Properties
		 * @return {Jamon}			  - The element wrapped in a Jamón instance
		 */
		static create (type, properties) {
			// create a new element of the given type
			const element = document.createElement(type);

			// add properties
			if (!isUndefined(properties)) {
				for (const property of Object.keys(properties)) {
					element[property] = properties[property];
				}
			}

			return Jamon.of(element);
		}
		
		/**
		 * The class name used for hide(), show(), and toggle()
		 * @type {string}
		 */
		static get hiddenClassName () {
			return hiddenClassName;
		}
		
		static set hiddenClassName (className) {			
			hiddenClassName = className;
		}

		/**
		 * Get a single element
		 * @param  {string|Element|Text|Document|Jamon} selector - The selector/element to use
		 * @return {Jamon|undefined}							 - New Jamón instance
		 */
		static get (selector) {
			let result;

			if (isUndefined(selector)) {
				// empty collection
				result = new Jamon();
			} else if (isString(selector)) {
				// selector
				result = Jamon.of(document.querySelector(selector));
			} else if (selector instanceof Node && [Node.ELEMENT_NODE, Node.DOCUMENT_NODE, Node.TEXT_NODE].includes(selector.nodeType)) {
				// element node, text node, or document node
				result = Jamon.of(selector);
			} else if ([Jamon, NodeList, HTMLCollection, Array].includes(selector.constructor)) {
				// other iterables
				result = selector.length ? Jamon.of(selector[0]) : new Jamon();
			} else {
				throw new TypeError();
			}

			return result;
		}

		/**
		 * Get multiple elements
		 * @param  {string|NodeList|HTMLCollection|Jamon} selector - The selector/element/collection to use
		 * @return {Jamon|undefined}							   - New Jamón instance
		 */
		static getAll (selector) {
			let result;

			if (isUndefined(selector)) {
				// empty collection
				result = new Jamon();
			} else if (isString(selector)) {
				// selector string
				result = Jamon.from(document.querySelectorAll(selector));
			} else if (selector instanceof Jamon) {
				// Jamon instance
				result = selector;
			} else if ([NodeList, HTMLCollection, Array].includes(selector.constructor)) {
				// other iterables
				result = Jamon.from(selector);
			} else {
				throw new TypeError();
			}

			return result;
		}
		
		/**
		 * An iterable that wraps each element in a Jamón instance
		 * @return {Iterable<Jamon>}
		 */
		* items () {
			for (const element of this) {
				yield Jamon.of(element);
			}
		}

		/**
		 * Add class name(s)
		 * @param {string} className - Space-separated list of class names
		 * @return {Jamon}		   - The instance
		 */
		addClass (className) {
			return addRemoveToggleClass(this, className, ClassListMethod.ADD);
		}

		/**
		 * Remove class name(s)
		 * @param  {string} className - Space-separated list of class names
		 * @return {Jamon}			- The instance
		 */
		removeClass (className) {
			return addRemoveToggleClass(this, className, ClassListMethod.REMOVE);
		}

		/**
		 * Toggle class name(s)
		 * @param  {string} className - Space-separated list of class names
		 * @return {Jamon}			- The instance
		 * @todo add second parameter?
		 */
		toggleClass (className) {
			return addRemoveToggleClass(this, className, ClassListMethod.TOGGLE);
		}

		/**
		 * Checks if the first element has the provided class name
		 * @param  {string} className - Class name to check
		 * @return {Boolean}		  - True if the element has the class name
		 */
		hasClass (className) {	 
			return this[0] && this[0].classList.contains(className);
		}

		/**
		 * Show the element(s)
		 * @return {Jamon} - The instance
		 */
		show () {
			return addRemoveToggleClass(this, hiddenClassName, ClassListMethod.REMOVE);
		}

		/**
		 * Hide the element(s)
		 * @return {Jamon} - The instance
		 */
		hide () {
			return addRemoveToggleClass(this, hiddenClassName, ClassListMethod.ADD);
		}

		/**
		 * Toggle the visibility of the element(s)
		 * @return {Jamon} - The instance
		 */
		toggle () {
			return addRemoveToggleClass(this, hiddenClassName, ClassListMethod.TOGGLE);
		}

		/**
		 * Get the value of the first element or set the values of the elements
		 * @param  {string=} value - Value to set
		 * @return {string|Jamon}  - Value (get) or the Jamón instance (set)
		 */
		val (value) {
			return getSetRemoveProperty(this, "value", value);
		}

		/**
		 * Get the html content of the first element or set the html content of the elements
		 * @param  {string=} html - HTML content to set
		 * @return {string|Jamon} - HTML content (get) or the Jamón instance (set)
		 */
		html (html) {
			return getSetRemoveProperty(this, "innerHTML", html !== null ? html : "");
		}

		/**
		 * Get the text content of the first element or set the text content of the elements
		 * @param  {string} text  - Text content to set
		 * @return {string|Jamon} - Text content (get) or the Jamón instance (set)
		 */
		text (text) {
			return getSetRemoveProperty(this, "textContent", text !== null ? text : "");
		}

		/**
		 * Get a property of the first element or set a property of each element
		 * @param  {string} property			 - Property name
		 * @param  {string|null|undefined} value - Property value to set (null to remove property)
		 * @return {string|Jamon}				- Property value (get) or the Jamón instance (set)
		 */
		prop (property, value) {
			return getSetRemoveProperty(this, property, value);
		}

		/**
		 * Get an attribute of the first element or set an attribute to each element
		 * @param  {string} attribute			- Attribute name
		 * @param  {string|null|undefined} value - Attribute value to set (null to remove attribute)
		 * @return {string|Jamon}				- Attribute value (get) or the Jamón instance (set)
		 */
		attr (attribute, value) {
			if (isUndefined(value)) {
				// get
				let first = this[0];
				return (first && first.hasAttribute(attribute)) ? first.getAttribute(attribute) : undefined;
			} else if (value !== null) {
				// set
				for (const element of this) {
					element.setAttribute(attribute, value);
				}
			} else {
				// remove
				for (const element of this) {
					element.removeAttribute(attribute);
				}
			}
			return this;
		}

		/**
		 * Get a single CSS property of the first element, or set one or more CSS properties on all elements
		 * @param  {string} property - Property name
		 * @param  {string} value - Property value
		 * @return {string|Jamon} - Property value (get) or the Jamón instance (set)
		 */
		css (property, value) {				
			if (isUndefined(value)) {
				// get
				let first = this[0];
				return first ? window.getComputedStyle(first).getPropertyValue(kebabCase(property)) : undefined;
			} else {
				// set
				for (const element of this) {
					element.style[camelCase(property)] = String(value);
				}
				return this;
			}
		}

		/**
		 * Get a data attribute of the first element or set a data attribute on all elements
		 * @param  {string} name - Attribute name
		 * @param  {*=} value - Attribute value
		 * @return {string|Jamon} - Attribute value (get) or the instance (set)
		 */
		data (name, value) {
			if (isUndefined(value)) {
				// get value
				const first = this[0];	
				return first ? first.dataset[name] : undefined;
			} else if (value !== null) {
				// set value
				for (const element of this) {
					element.dataset[name] = value;
				}
				return this;
			} else {
				// remove value
				for (const element of this) {
					delete element.dataset[name];
				}
				return this;
			}
		}

		/**
		 * Get the width of the first element
		 * @return {number} - The width of the element
		 */
		width () {
			return this[0].getBoundingClientRect().width;
		}

		/**
		 * Get the height of the first element
		 * @return {number} - The height of the element
		 */
		height () {
			return this[0].getBoundingClientRect().height;
		}

		/**
		 * Get the offset (position relative to the offsetParent) of the first element
		 * @return {{left: number, top: number}} - The offset of the element
		 */
		offset () {
			const element = this[0];
			return {
				left: element.offsetLeft,
				top: element.offsetTop
			};
		}

		/**
		 * Get the absolute position of the first element or set the absolute position of all elements
		 * @param  {{left: number, top: number}=} position - Position to set
		 * @return {{left: number, top: number}|Jamon}	 - Position (get) or the instance (set)
		 */
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
					computedStyle = getComputedStyle(element),
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
			
			return this;
		}

		/**
		 * Find the first descendant that matches the selector in any of the elements
		 * @param  {string} selector - Selector to match
		 * @return {Jamon|undefined} - A new Jamón instance containing the matched element
		 */
		findOne (selector) {
			let result = new Jamon();

			for (const element of this) {
				const found = findInElement(element, selector, true);
				
				if (found) {
					// break and return the first result
					result.push(found);
					break;
				}
			}
			
			return result;
		}

		/**
		 * Find all descendants that match the selector in any of the elements
		 * @param  {string} selector - Selector to match
		 * @return {Jamon}		   - A new Jamón instance containing the matched elements
		 * @todo Handle duplicates?
		 */
		findAll (selector) {
			let results = new Jamon();

			for (const element of this) {
				const found = findInElement(element, selector);
				if (found.length) {
					results = results.concat(...found);
				}
			}

			return results;
		}

		/**
		 * Get the parent of each element
		 * @return {Jamon} - A new Jamón instance containing the parents
		 */
		parent () {
			const parents = new Jamon();

			for (const element of this) {
				parents.push(element.parentElement);
			}

			return parents;
		}

		/**
		 * Get the children of each element
		 * @return {Jamon} - A new Jamón instance containing the children
		 */
		children () {
			const children = new Jamon();

			for (const element of this) {
				children.push(...Array.from(element.children));
			}

			return children;
		}
		
		/**
		 * Get the first ancestor that matches the provided selector of each element
		 * @param  {string} selector - The selector to match ancestors against
		 * @return {Jamon}		   - A new Jamón instance containing the matched ancestors
		 */
		closest (selector) {
			const closests = new Jamon();

			for (const element of this) {
				closests.push(element.closest(selector));
			}

			return closests;
		}

		/**
		 * Prepend a Jamón element or string to the element
		 * @param  {Jamon|string} subject - The element or string to prepend
		 * @return {Jamon}				- The Jamón instance
		 */
		prepend (subject) {
			return insertNode(subject, this, NodeMethod.PREPEND, 1);
		}

		/**
		 * Prepend element to another Jamón element
		 * @param  {Jamon} target - The target
		 * @return {Jamon}		- The Jamón instance
		 */
		prependTo (target) {
			return insertNode(this, target, NodeMethod.PREPEND, 0);
		}

		/**
		 * Append a Jamón element or string to the element
		 * @param  {Jamon|string} subject - The element or string to append
		 * @return {Jamon}				- The Jamón instance
		 */
		append (subject) {
			return insertNode(subject, this, NodeMethod.APPEND, 1);
		}

		/**
		 * Append the element to another Jamón element
		 * @param  {Jamon} target - The target
		 * @return {Jamon}		- The Jamón instance
		 */
		appendTo (target) {
			return insertNode(this, target, NodeMethod.APPEND, 0);
		}

		/**
		 * Insert another Jamón element before the element
		 * @param  {Jamon|string} subject - The element or string to insert
		 * @return {Jamon}				- The Jamón instance
		 */
		before (subject) {
			return insertNode(subject, this, NodeMethod.BEFORE, 1);
		}

		/**
		 * Insert the element before another Jamón element
		 * @param  {Jamon} target - The target
		 * @return {Jamon}		- The Jamón instance
		 */
		insertBefore (target) {
			return insertNode(this, target, NodeMethod.BEFORE, 0);
		}

		/**
		 * Insert another Jamón element after the element
		 * @param  {Jamon|string} subject - The element or string to insert
		 * @return {Jamon}				- The Jamón instance
		 */
		after (subject) {
			return insertNode(subject, this, NodeMethod.AFTER, 1);
		}

		/**
		 * Insert the element after another Jamón element
		 * @param  {Jamon} target - The target
		 * @return {Jamon}		- The Jamón instance
		 */
		insertAfter (target) {
			return insertNode(this, target, NodeMethod.AFTER, 0);
		}

		/**
		 * Replace the element with another Jamón element
		 * @param  {Jamon|string} subject - The element or string to insert
		 * @return {Jamon}				- The Jamón instance
		 */
		replaceWith (subject) {
			return insertNode(subject, this, NodeMethod.REPLACE, 1);
		}

		/**
		 * Replace another Jamón element with the element
		 * @param  {Jamon} target - The target to replace
		 * @return {Jamon}		- The Jamón instance
		 */
		replace (target) {
			return insertNode(this, target, NodeMethod.REPLACE, 0);
		}

		/**
		 * Clones the collection
		 * @param {boolean} deep - Deep clone
		 * @return {Jamon}	   - A new Jamón collection with the clones
		 */
		clone (deep) {
			const clones = new Jamon();

			for (const element of this) {
				clones.push(element.cloneNode(deep));
			}

			return clones;
		}

		/**
		 * Remove the elements from the DOM
		 * @return {Jamon} - The Jamón instance
		 */
		remove () {
			for (const element of this) {
				element.remove();
				// remove adjacent textNodes
				element.parentNode.normalize();
			}

			return this;
		}

		// Add an event listener
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
				if (target[matchMethod](selector)) {
					listener.call(target, e);
				}
			};
			// assign a unique ID to proxied listeners
			if (!listener[listenerID]) {
				listener[listenerID] = listenerIndex++;
			}
			// store the proxy so we can remove it later
			proxyMap.set(getProxyId(listener, selector), proxy);

			return this.on(event, proxy);
		}

		// Trigger event on the element
		trigger (type, data) {
			let event = Event,
				bubbles = false,
				cancelable = false;
				
			data = data || {};

			// Set up event properties based on event type
			if (!isUndefined(data.detail)) {
				event = CustomEvent;
			} else if (EventRegExp.MOUSE.test(type)) {
				event = MouseEvent;
				bubbles = true;
				cancelable = true;
			} else if (EventRegExp.FOCUS.test(type)) {
				event = FocusEvent;
				if (type === "change") {
					bubbles = true;
				}
			} else if (EventRegExp.FORM.test(type)) {
				bubbles = true;
				cancelable = true;
			} else if (EventRegExp.KEYBOARD.test(type)) {
				event = KeyboardEvent;
				bubbles = true;
				cancelable = true;
			} else if (EventRegExp.TOUCH.test(type)) {
				event = TouchEvent;
				bubbles = true;

				if (type !== "touchcancel") {
					cancelable = true;
				}
			/*
			} else if (EventRegExp.POINTER.test(type)) {
				let exceptions = ["pointerenter", "pointerleave"];
				event = PointerEvent;
				if (!exceptions.includes(type)) {
					bubbles = true;
				}
				exceptions.push("pointercancel");
				if (!exceptions.includes(type)) {
					cancelable = true;
				}
			*/
			}
			
			for (const element of this) {
				element.dispatchEvent(new event(type, Object.assign(data, {bubbles, cancelable})));
			}

			return this;
		}
	}

	// Exports
	window.Jamon = Jamon;
	if (isUndefined(window.$) && isUndefined(window.$$)) {
		window.$ = Jamon.get;
		window.$$ = Jamon.getAll;
	}
}
