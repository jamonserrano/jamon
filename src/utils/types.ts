export type Item = Element | Text | Document | DocumentFragment | Window;

type Iterable = Collection | NodeList | HTMLCollection;

export type Selector =
	undefined
	| string
	| Item
	| Iterable;

export type Collection = Array<Item>;

// Guards
export const isUndefined = (ref: any): ref is undefined =>
	ref === undefined;

export const isString = (ref: any): ref is string =>
	typeof ref === 'string';

export const isItem = (ref: any): ref is Item =>
	ref instanceof Element
	|| ref instanceof Text
	|| ref instanceof Document
	|| ref instanceof DocumentFragment
	|| ref instanceof Window;

export const isIterable = (ref: any): ref is Iterable =>
	Array.isArray(ref) || ref instanceof NodeList || ref instanceof HTMLCollection;