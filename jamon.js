/*
 *  Copyright (c) 2016 Viktor Honti
 *  Licensed under the MIT License.
 *  https://github.com/jamonserrano/jamon
 */

"use strict";
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
		const Jamon = factory();
        root.Jamon = Jamon;
		if (typeof root.$ === 'undefined' && typeof root.$$ === 'undefined') {
			root.$ = Jamon.get;
			root.$$ = Jamon.getAll;
		}
	}
}(this, function () {

	/**
	 * Class name used for hiding elements - can be overriden
	 * @private
	 * @type {string}
	 */
	let hiddenClassName = "hidden";

	/**
	 * Unique property name to store proxies on listener functions
	 * @private
	 * @type {symbol}
	 */
	const proxyKey = Symbol();

	/**
	 * Unique property name to store listeners on elements
	 * @private
	 * @type {symbol}
	 */
	const listenerKey = Symbol();

	/**
	 * Turn CSS property names into their JS counterparts (eg. margin-top --> marginTop)
	 * @private
	 * @param  {string} property - CSS property name
	 * @return {string} - JS property name
	 */
	function toCamelCase (property) {
		return property.replace(/-([a-z])/g, (nothing, match) => match.toUpperCase());
	}
	
	/**
	 * Turn JS property names into their CSS counterparts (eg. marginTop --> margin-top)
	 * @private
	 * @param  {string} property - JS property name
	 * @return {string}	- CSS property name
	 */
	function toKebabCase (property) {
		return property.replace(/([A-Z])/g, (match) => "-" + match.toLowerCase());
	}
	
	/**
	 * Trims and splits a string
	 * @private
	 * @param {string} value - The string to process
	 * @return {Array} - The array of strings
	 */
	function trimAndSplit (value) {
		return value ? String(value).trim().split(" ") : [];
	}

	/**
	 * Check if a reference is undefined
	 * @private
	 * @param  {*} reference - The reference to check
	 * @return {boolean} - The undefinedness of the reference
	 */
	function isUndefined (reference) {
		return typeof reference === "undefined";
	}

	/**
	 * Check if a reference is a String
	 * @private
	 * @param  {*} reference - The reference to check
	 * @return {boolean} - The stringness of the reference
	 */
	function isString (reference) {
		return typeof reference === "string";
	}

	/**
	 * @private
	 * @param {*} value the value to check
	 * @return {boolean}
	 */
	function isIterable (value) {
		return Array.isArray(value) || value instanceof NodeList || value instanceof HTMLCollection;
	}

	/**
	 * Add, remove, or toggle class names
	 * @private
	 * @param {Jamon} context - The Jamón instance
	 * @param {string} className - Space-separated class names
	 * @param {string} method - Method to use on the class name(s)
	 * @return {Jamon}
	 */
	function addRemoveToggleClass (context, className, method) {
		// Split by spaces, then remove empty elements caused by extra whitespace
		const classNames = trimAndSplit(className);

		if (classNames.length) {
			for (const element of context) {
				if (method !== "toggle") {
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
	 * Get, set or remove element properties
	 * @private
	 * @param  {Jamon} collection - The Jamón instance
	 * @param  {string} property - Property name
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
	 * Get the width or height of the first element in the collection
	 * @private
	 * @param {Jamon} collection - The Jamón instance
	 * @param {string} dimension - The dimension to get
	 * @return {number|undefined} - The result
	 */
	function getDimension (collection, dimension) {
		const first = collection[0];
		if (first && typeof first.getBoundingClientRect === "function") {
			return first.getBoundingClientRect()[dimension];
		}
	}

	/**
	 * Call node methods on multiple targets and with multiple subjects
	 * @private
	 * @param {Jamon} targets
	 * @param {Jamon} subjects
	 * @param {string} method - node method to call
	 * @param {boolean} returnTargets - return the targets?
	 * @return {Jamon}
	 * @todo jamonize both targets and subjects if needed
	 */
	function callNodeMethod(targets, subjects, method, returnTargets) {
		for (const target of targets) {
			const subject = targets.indexOf(target) ? clone(subjects, true) : subjects;
			
			if (isIterable(subjects)) {
				target[method](...subject);
			} else {
				target[method](subject);
			}
			
			normalize(target);
		}
		
		return returnTargets ? targets : subjects;
	}

	/**
	 * Normalize text nodes
	 * @private
	 * @param {Node} node
	 * @param {string} method - node method that needs normalization
	 */
	function normalize(node, method) {
		if (method === "prepend" || method === "append") {
			node.normalize();
		} else if (node.parentNode) {
			node.parentNode.normalize();
		}
	}

	/**
	 * Clone each element in a collection
	 * @private
	 * @param {Jamon} collection
	 * @param {boolean} [deep=true] - deep clone?
	 * @return {Jamon} the cloned collection
	 */
	function clone(collection, deep = true) {
		const clones = new Jamon();
		for (const element of collection) {
			clones.push(element.cloneNode(deep));
		}

		return clones;
	}

	/**
	 * Generate a proxy for the given listener-selector combination
	 * @private
	 * @param {Function} listener - the listener function
	 * @param {string} selector - the selector
	 * @return {Function} - the listener or the proxy
	 */
	function getProxiedListener (listener, selector) {
			// get existing proxy storage of the listener
			let proxies = listener[proxyKey];
			// the proxy to return
			let proxy;

			// or create the storage
			if (isUndefined(proxies)) {
				proxies = new Map();
				listener[proxyKey] = proxies;
			}

			if (proxies.has(selector)) {
				// a proxy for this selector already exists - get it
				proxy = proxies.get(selector);
			} else {
				// create a new proxy for this selector
				proxy = function (e) {
					const target = e.target;
					// only call the listener if the target matches the selector
					if (target.matches(selector)) {
						listener.call(target, e);
					}
				}
				// store proxy
				proxies.set(selector, proxy);
			}

			return proxy;
	}

	/**
	 * Get the event listener key for the given event-selector combination
	 * @private
	 * @param  {string} type - The event type
	 * @param  {string} selector - The selector
	 * @return {string}	- Unique listener key
	 */
	function getEventKey (type, selector = "") {
		return `${type}|${selector}`;
	}

	/**
	 * Runs querySelectorAll WITHIN the element (unlike native qSA)
	 * @private
	 * @param  {HTMLElement} element - The search context
	 * @param  {string} selector - The selector to use in the query
	 * @param  {boolean=} one - Do we want only one result?
	 * @return {HTMLElement|NodeList} - The result of the query
	 */
	function findInElement (element, selector, one) {
		const method = one ? "querySelector" : "querySelectorAll";
		let id = element.id;
		let temporaryId = false;
		let result;

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
		 * @param  {string} type - Element type
		 * @param  {Object=} properties - Properties
		 * @return {Jamon} - The element wrapped in a Jamón instance
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
		 * @param  {string|Window|Element|Text|Document|Jamon|Array|NodeList|HTMLCollection=} selector - The selector/element to use
		 * @return {Jamon} - A new Jamón instance
		 */
		static get (selector) {
			// empty collection
			if (isUndefined(selector)) {
				return new Jamon();
			}
			// selector string
			if (isString(selector)) {
				const result = document.querySelector(selector);
				return result ? Jamon.of(result) : new Jamon();
			}
			// Element, Text, Document, DocumentFragment
			if (selector === window || (selector instanceof Node && [1, 3, 9, 11].includes(selector.nodeType))) {
				return Jamon.of(selector);
			}
			// iterables with ordered items (Jamon, Array, NodeList, HTMLCollection)
			if (isIterable(selector)) {
				// length is 0 or nonexistent -> empty collection
				return selector.length ? Jamon.of(selector[0]) : new Jamon();
			}
		}

		/**
		 * Get multiple elements
		 * @param  {string|Jamon|Array|NodeList|HTMLCollection=} selector - The selector/element/collection to use
		 * @return {Jamon} - A new Jamón instance
		 */
		static getAll (selector) {
			// empty collection
			if (isUndefined(selector)) {
				return new Jamon();
			} 
			// selector string
			if (isString(selector)) {
				return Jamon.from(document.querySelectorAll(selector));
			}
			// Jamon instance
			if (selector instanceof Jamon) {
				return selector;
			}
			// iterables with ordered items (Array, NodeList, HTMLCollection)
			if (isIterable(selector)) {
				return selector.length ? Jamon.from(selector) : new Jamon();
			}
			// one of something
			return Jamon.of(selector);
		}
		
		/**
		 * An iterable that wraps each element in a Jamón instance
		 * @return {iterable<Jamon>}
		 */
		* items () {
			for (const element of this) {
				yield Jamon.of(element);
			}
		}

		/**
		 * Add class name(s)
		 * @param {string} className - Space-separated list of class names
		 * @return {Jamon} - The Jamón instance
		 */
		addClass (className) {
			return addRemoveToggleClass(this, className, "add");
		}

		/**
		 * Remove class name(s)
		 * @param  {string} className - Space-separated list of class names
		 * @return {Jamon} - The Jamón instance
		 */
		removeClass (className) {
			return addRemoveToggleClass(this, className, "remove");
		}

		/**
		 * Toggle class name(s)
		 * @param  {string} className - Space-separated list of class names
		 * @return {Jamon} - The Jamón instance
		 */
		toggleClass (className) {
			return addRemoveToggleClass(this, className, "toggle");
		}

		/**
		 * Checks if the first element has the provided class name
		 * @param  {string} className - Class name to check
		 * @return {Boolean} - True if the element has the class name
		 */
		hasClass (className) {
			// * Chrome doesn't allow undefined or empty string param	 
			return className && this[0] && this[0].classList.contains(String(className).trim());
		}

		/**
		 * Show the element(s)
		 * @return {Jamon} - The Jamón instance
		 */
		show () {
			return addRemoveToggleClass(this, hiddenClassName, "remove");
		}

		/**
		 * Hide the element(s)
		 * @return {Jamon} - The Jamón instance
		 */
		hide () {
			return addRemoveToggleClass(this, hiddenClassName, "add");
		}

		/**
		 * Toggle the visibility of the element(s)
		 * @return {Jamon} - The Jamón instance
		 */
		toggle () {
			return addRemoveToggleClass(this, hiddenClassName, "toggle");
		}

		/**
		 * Get the value of the first element or set the values of the elements
		 * @param  {string=} value - Value to set
		 * @return {string|Jamon} - Value (get) or the Jamón instance (set)
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
		 * @param  {string} text - Text content to set
		 * @return {string|Jamon} - Text content (get) or the Jamón instance (set)
		 */
		text (text) {
			return getSetRemoveProperty(this, "textContent", text !== null ? text : "");
		}

		/**
		 * Get a property of the first element or set a property of each element
		 * @param  {string} property - Property name
		 * @param  {string|null|undefined} value - Property value to set (null to remove property)
		 * @return {string|Jamon} - Property value (get) or the Jamón instance (set)
		 */
		prop (property, value) {
			return getSetRemoveProperty(this, property, value);
		}

		/**
		 * Get an attribute of the first element or set an attribute to each element
		 * @param  {string} attribute - Attribute name
		 * @param  {string|null|undefined} value - Attribute value to set (null to remove attribute)
		 * @return {string|Jamon} - Attribute value (get) or the Jamón instance (set)
		 */
		attr (attribute, value) {
			if (isUndefined(value)) {
				// get
				const first = this[0];
				// getAttribute returns null for missing attributes
				return first && first.hasAttribute(attribute) ? first.getAttribute(attribute) : undefined;
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
				const first = this[0];
				return first ? window.getComputedStyle(first).getPropertyValue(toKebabCase(property)) : undefined;
			} else {
				// set
				for (const element of this) {
					element.style[toCamelCase(property)] = String(value);
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
			return getDimension(this, "width");
		}

		/**
		 * Get the height of the first element
		 * @return {number} - The height of the element
		 */
		height () {
			return getDimension(this, "height");
		}

		/**
		 * Get the offset (position relative to the offsetParent) of the first element
		 * @return {{left: number, top: number}} - The offset of the element
		 */
		offset () {
			const first = this[0];
			return {
				left: first.offsetLeft,
				top: first.offsetTop
			};
		}

		/**
		 * Get the absolute position of the first element or set the absolute position of all elements
		 * @param  {{left: number, top: number}=} position - Position to set
		 * @return {{left: number, top: number}|Jamon} - Position (get) or the instance (set)
		 */
		position (position) {
			const rect = this[0].getBoundingClientRect();
			if (isUndefined(position)) {
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
					// get the original position of relative and absolute positioned elements
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
		 * @return {Jamon} - A new Jamón instance containing the matched element
		 */
		findOne (selector) {
			const result = new Jamon();

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
		 * @return {Jamon} - A new Jamón instance containing the matched elements
		 * @todo Handle duplicates?
		 */
		findAll (selector) {
			const results = new Jamon();

			for (const element of this) {
				// add results to the collection
				const found = findInElement(element, selector);
				if (found.length) {
					results.push(...found);
				}
			}

			return results;
		}

		/**
		 * Get the parent of each element
		 * @return {Jamon} - A new Jamón instance containing the parents
		 */
		parent () {
			const results = new Jamon();

			for (const element of this) {
				const parent = element.parentElement;
				
				// skip nonexistent and duplicate items
				if (parent && !results.includes(parent)) {
					results.push(parent);
				}
			}

			return results;
		}

		/**
		 * Get the children of each element
		 * @return {Jamon} - A new Jamón instance containing the children
		 */
		children () {
			const results = new Jamon();

			for (const element of this) {
				results.push(...element.children);
			}

			return results;
		}
		
		/**
		 * Get the first element that matches the provided selector of each element
		 * @param  {string} selector - The selector to match elements against
		 * @return {Jamon} - A new Jamón instance containing the matched elements
		 */
		closest (selector) {
			const results = new Jamon();

			for (const element of this) {
				if (typeof element.closest === "function") {
					const closest = element.closest(selector);
					// skip nonexistent and duplicate items
					if (closest && !results.includes(closest)) {
						results.push(closest);
					}
				}
			}

			return results;
		}

		/**
		 * Prepend a Jamón element or string to the element
		 * @param  {Jamon|string} subject - The element or string to prepend
		 * @return {Jamon} - The Jamón instance
		 */
		prepend (subjects) {
			return callNodeMethod(this, subjects, "prepend", true);
		}

		/**
		 * Prepend element to another Jamón element
		 * @param  {Jamon} target - The target
		 * @return {Jamon} - The Jamón instance
		 */
		prependTo (target) {
			return callNodeMethod(target, this, "prepend");
		}

		/**
		 * Append a Jamón element or string to the element
		 * @param  {Jamon|string} subject - The element or string to append
		 * @return {Jamon} - The Jamón instance
		 */
		append (subjects) {
			return callNodeMethod(this, subjects, "append", true);
		}

		/**
		 * Append the element to another Jamón element
		 * @param  {Jamon} target - The target
		 * @return {Jamon} - The Jamón instance
		 */
		appendTo (target) {
			return callNodeMethod(target, this, "append");
		}

		/**
		 * Insert another Jamón element before the element
		 * @param  {Jamon|string} subject - The element or string to insert
		 * @return {Jamon} - The Jamón instance
		 */
		before (subjects) {
			return callNodeMethod(this, subjects, "before", true);
		}

		/**
		 * Insert the element before another Jamón element
		 * @param  {Jamon} target - The target
		 * @return {Jamon} - The Jamón instance
		 */
		insertBefore (target) {
			return callNodeMethod(target, this, "before");
		}

		/**
		 * Insert another Jamón element after the element
		 * @param  {Jamon|string} subject - The element or string to insert
		 * @return {Jamon} - The Jamón instance
		 */
		after (subjects) {
			return callNodeMethod(this, subjects, "after", true);
		}

		/**
		 * Insert the element after another Jamón element
		 * @param  {Jamon} target - The target
		 * @return {Jamon} - The Jamón instance
		 */
		insertAfter (target) {
			return callNodeMethod(target, this, "after");
		}

		/**
		 * Replace the element with another Jamón element
		 * @param  {Jamon|string} subject - The element or string to insert
		 * @return {Jamon} - The Jamón instance
		 */
		replaceWith (subjects) {
			return callNodeMethod(this, subjects, "replaceWith", true);
		}

		/**
		 * Replace another Jamón element with the element
		 * @param  {Jamon} target - The target to replace
		 * @return {Jamon} - The Jamón instance
		 */
		replace (target) {
			return callNodeMethod(target, this, "replaceWith");
		}

		/**
		 * Clones the collection
		 * @param {boolean} deep - Deep clone
		 * @return {Jamon} - A new Jamón collection with the clones
		 */
		clone (deep) {
			return clone(this, deep);
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

		/**
		 * Add an event listener
		 * @param {string} events - Space-separated list of events
		 * @param {string=} selector - Selector to use for delegation
		 * @param {function} listener - Listener function to add
		 * @return {Jamon} - The Jamón instance
		 */
		on (events, selector, listener) {
			if (isUndefined(listener)) {
				// normalize arguments
				listener = selector;
				selector = undefined;
			} else {
				// get proxied listener
				listener = getProxiedListener(listener, selector);
			}
						
			for (const event of trimAndSplit(events)) {
				// get event key for the event-selector combination
				const eventKey = getEventKey(event, selector);

				for (const element of this) {
					// get or create listener storage on the element
					let eventListeners = element[listenerKey];
					if (isUndefined(eventListeners)) {
						eventListeners = new Map();
						element[listenerKey] = eventListeners;
					}
					
					// get or create listener group (listening for the same event key)
					let listenerGroup = eventListeners.get(eventKey);
					if (isUndefined(listenerGroup)) {
						listenerGroup = new Set();
						eventListeners.set(eventKey, listenerGroup);
					}

					// add listener and store it in the group (no duplicates allowed)
					if (!listenerGroup.has(listener)) {
						// add reference to the listener group
						listenerGroup.add(listener);
						// add DOM event listener
						element.addEventListener(event, listener);
					}					
				}
			}

			return this;
		}

		/**
		 * Remove an event listener
		 * @param {string} events - Space-separated list of events
		 * @param {string} selector - The selector used for delegation
		 * @param {function} listener - Listener function to remove
		 * @return {Jamon} - The Jamón instance
		 */
		
		off (events, selector, listener) {			
			if (isUndefined(listener)) {
				// no delegation -> reassign arguments
				listener = selector;
				selector = undefined;
			} else {
				// delegation -> get proxied listener from proxy storage
				listener = listener[proxyKey].get(selector);
			}

			for (const event of trimAndSplit(events)) {
				// get event key for the event-selector combination
				const eventKey = getEventKey(event, selector);

				for (const element of this) {
					// remove reference from the listener group
					element[listenerKey].get(eventKey).delete(listener);
					// remove DOM event listener
					element.removeEventListener(event, listener);
				}
			}

			return this;
		}

		/**
		 * Trigger an event
		 * @param {string} type - Event type
		 * @param {Object=} eventData - Event data
		 * @return {Jamon} - The Jamón instance
		 */
		trigger (type, eventData = {}) {
			eventData = Object.assign(eventData, {
				bubbles: true,
				cancelable: true
			});

			for (const element of this) {
				element.dispatchEvent(new CustomEvent(type, eventData));
			}

			return this;
		}
	}

	return Jamon;
}));
