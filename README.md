# Jamón [![Build Status](https://travis-ci.org/jamonserrano/jamon.svg?branch=master)](https://travis-ci.org/jamonserrano/jamon)
My take on a DOM library (aka jQuery, the good parts)

## Usage

Use `$(selector)` or `Jamon.$(selector)` to select a single element:

```
$("div");
$(".menu");
$("#Header");
```

Use `$$(selector)` or `Jamon.$$(selector)` to select multiple elements:

```
$$("a > span");
$$(".menu");
$$("#section-1, #section2");
```

## Supported browsers
Evergreen browsers with decent ES2015 support: Chrome, Firefox, Edge.

## API
Jamón currently supports the following methods:

### Attributes

#### addClass(className)
Adds a class name or a list of space-separated class names to the element(s).

#### removeClass(className)
Removes a class name or a list of space-separated class names from the element(s).

#### toggleClass(className)
Toggles a class name or each class name of a space-separated list on the element(s).

#### val([value])
Gets the value of the first element or sets the value of each element.

#### html([value])
Gets the html content of the first element or sets the html content of each element.

#### text([value])
Gets the text content of the first element or sets the text content of each element.

#### prop(property [, value])
Gets the value of a property of the first element or sets the value of a property of each element.

#### attr(attribute [, value])
Gets the value of an attribute of the first element or sets the value of an attribute of each element.

#### data(attribute [, value])
Gets the value of the data attribute for the first element or sets the data attribute value for each element.

### Styling
> For show(), hide() and toggle() to work you need to include the following line in your CSS:
```css
.hidden {display: none !important;}
```
You can change the `hidden` class name with `jamon.setHiddenClassName()`

#### show()
Shows the element(s) by adding the `hidden` class name.

#### hide()
Hides the element(s) by removing the `hidden` class name.

#### toggle()
Toggles the element(s) by toggling the `hidden` class name.

#### css(property [, value])
Gets the computed value of the CSS property for the first element or sets the value of the CSS property for each element.

#### css(properties)
Sets the values of the the CSS properties in the object for each element.

#### width()
Gets the width of the first element.

#### height()
Gets the height of the first element.

#### scrollWidth()
Gets the scroll width of the first element.

#### scrollHeight()
Gets the scroll height of the first element.

#### scrollLeft(value)
Gets the horizontal scroll position for the first element or sets the horizontal scroll position for each element.

#### scrollTop(value)
Gets the vertical scroll position for the first element or sets the vertical scroll position for each element.

#### offset()
Gets the offset position of the first element relative to the offset parent.

#### position()
Gets the absolute position of the first element or sets the position of each element relative to the page.

### DOM Traversal

#### parent()
Gets the parent element of each element.

#### firstChild()
Gets the first element child of each element.

#### lastChild()
Gets the last element child of each element.

#### children()
Gets the children elements of each element.

#### contents()
Gets all children (including text nodes) of each element.

#### closest([selector])
Gets the closest parent (matching the optional selector) of each element.

#### findOne(selector)
Finds the first descendant that matches the selector in any of the elements.

#### findAll(selector)
Finds all descendants that match the selector in each element.

### Manipulation
>These methods only work with one subject i.e. the first element in the collection.

#### prepend(subject)
Prepends the subject (element or text node) to each element. If there are multiple elements, clones of the subject will be used.

#### prependTo(target)
Prepends the first element to the target element(s). If there are multiple targets, clones of the element will be used.

#### append(subject)
Appends the subject (element or text node) to each element. If there are multiple elements, clones of the subject will be used.

#### appendTo(target)
Appends the first element to the target element(s). If there are multiple targets, clones of the element will be used.

#### before(subject)
Inserts the subject (element or text node) before each element. If there are multiple elements, clones of the subject will be used.

#### insertBefore(target)
Inserts the first element before the target element(s). If there are multiple targets, clones of the elements will be used.

#### after(subject)
Inserts the subject (element or text node) after each element. If there are multiple elements, clones of the subject will be used.

#### insertAfter(target)
Inserts the first element after the target element(s). If there are multiple targets, clones of the elements will be used.

#### replaceWith(subject)
Replaces each element with the subject element. If there are multiple targets, clones of the subject will be used.

#### replaceAll(target)
Replaces the target element(s) with the first element. If there are multiple targets, clones of the element will be used.

#### clone(deep)
Clones each element.

#### remove()
Removes each element from the DOM.

#### filterBy(selector)
Returns a new Jamón instance containing only the elements that match the selector.


### Events

#### on(events, listener)
Adds the listener for each of the events in a space-separated list to each element.

#### delegate(event, selector, listener)
Delegates events from the elements matching the selector to the listener.

#### off(events [,selector] , listener)
Removes the standard or delegated event listeners from the elements.

#### trigger(event [, data])
Triggers an event on each element. The additional event data can be accessed in the event.detail property. Supported native events: mouse, focus and keyboard events.

### Working with Jamón instances
Jamón is a subclass of the built-in Array so instances behave just like regular arrays. You can use all the prototype methods like `forEach`, `map`, `push`, `join`, etc, or iterate with `for...of` loops.

### Utilities

#### Jamon.create(nodeType)
Creates a new HTML element.

#### Jamon.hiddenClassName
Overrides the default class name ('hidden') used for hiding elements.
