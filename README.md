# Jamón [![Build Status](https://travis-ci.org/jamonserrano/jamon.svg?branch=master)](https://travis-ci.org/jamonserrano/jamon) [![Coverage Status](https://coveralls.io/repos/github/jamonserrano/jamon/badge.svg?branch=master)](https://coveralls.io/github/jamonserrano/jamon)

Lightweight ES6 DOM library


## Usage

Use `$(selector)` or `Jamon.get(selector)` to select a single element:

```
$("div");
$(".menu");
$("#Header");
```

Use `$$(selector)` or `Jamon.getAll(selector)` to select multiple elements:

```
$$("a > span");
$$(".menu");
$$("#section-1, #section2");
```

> Jamón only registers the globals `$()` and `$$()` if they are unused. 


## API

### Working with Jamón instances
Jamón extends the built-in Array so instances behave just like regular arrays.
You can use all [array prototype methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Array_instances)
like `forEach`, `map`, `push`, `join`, etc, or iterate with `for...of` loops.

#### items()
Provides an Iterable that yields each element wrapped in a Jamón instance


### Classes

#### addClass(className)
Adds a class name or a list of space-separated class names to the element(s).

#### removeClass(className)
Removes a class name or a list of space-separated class names from the element(s).

#### toggleClass(className)
Toggles a class name or each class name of a space-separated list on the element(s).

#### show()
Shows the element(s) by adding the `hidden` class name.

#### hide()
Hides the element(s) by removing the `hidden` class name.

#### toggle()
Toggles the element(s) by toggling the `hidden` class name.

> For show(), hide() and toggle() to work you need to include the following line in your CSS:
```css
.hidden { display: none !important; }
```
> You can customize this class name by changing the value of `Jamon.hiddenClassName`.


### Attributes

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

#### css(property [, value])
Gets the computed value of the CSS property for the first element or sets the value of the CSS property for each element.


### Dimensions

#### width()
Gets the width of the first element.

#### height()
Gets the height of the first element.


### Positioning

#### offset()
Gets the offset position of the first element relative to the offset parent.

#### position()
Gets the absolute position of the first element or sets the position of each element relative to the page.


### DOM Traversal

#### findOne(selector)
Finds the first descendant that matches the selector in any of the elements.

#### findAll(selector)
Finds all descendants that match the selector in each element.

#### parent()
Gets the parent element of each element.

#### closest(selector)
Gets the closest parent matching the selector of each element.

#### children()
Gets the children elements of each element.


### Manipulation
These methods only work with one subject and one target i.e. the first element in the collection.

#### prepend(subject)
Prepends another element or string to the element.

#### prependTo(target)
Prepends the first element to another element.

#### append(subject)
Appends another element or string to the element.

#### appendTo(target)
Appends the element to another element.

#### before(subject)
Inserts another element or string before the element.

#### insertBefore(target)
Inserts the element before another element.

#### after(subject)
Inserts another element or string after the element.

#### insertAfter(target)
Inserts the element after another element.

#### replaceWith(subject)
Replaces the element with another element.

#### replace(target)
Replaces another element with the element.

#### clone(deep)
Clones each element in the collection.

#### remove()
Removes each element from the DOM.


### Events

#### on(events, [,selector] , listener)
Adds the listener for each of the events to each element. Provide an optional selector string for event delegation.

#### off(events [,selector] , listener)
Removes the standard or delegated event listeners from the elements.

#### trigger(event [, data])
Triggers an event on each element. The additional event data can be accessed in the event.detail property. Supported native events: mouse, focus and keyboard events.


### Utilities

#### Jamon.get(selector|element)
Creates a new Jamón collection with only one element.

#### Jamon.getAll(selector|iterable)
Creates a new Jamón collection with multiple elements.

#### Jamon.create(tagName)
Creates a new HTML element.

#### Jamon.hiddenClassName
Overrides the default class name `hidden` used for hiding elements.
