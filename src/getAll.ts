import { Selector, Collection, isString, isUndefined, isIterable, isItem } from './utils/types';

export const getAll = (selector: Selector): Collection => {
	if (isUndefined(selector)) {
		return [];
	} 

	if (isString(selector)) {
		return [...document.querySelectorAll(selector)];
	}

	if (isItem(selector)) {
		return [selector];
	}

	if (isIterable(selector)) {
		return [...selector].filter(isItem);
	}
	
	throw new TypeError();
	
}