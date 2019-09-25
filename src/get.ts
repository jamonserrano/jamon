import { Selector, Collection, isString, isUndefined, isIterable, isItem } from './utils/types';

export const get = (selector: Selector): Collection => {
	if (isUndefined(selector)) {
		return [];
	}

	if (isString(selector)) {
		const result = document.querySelector(selector);
		return result ? [result] : [];
	}

	if (isItem(selector)) {
		return [selector];
	}

	if (isIterable(selector)) {
		const result = [...selector].find(isItem);
		return result ? [result] : [];
	}

	throw new TypeError();
}