type Input =
	| HTMLInputElement
	| HTMLSelectElement
	| HTMLOptionElement
	| HTMLTextAreaElement
	| HTMLButtonElement;

export const isInput = (ref: Element): ref is Input =>
	ref instanceof HTMLInputElement ||
	ref instanceof HTMLSelectElement ||
	ref instanceof HTMLOptionElement ||
	ref instanceof HTMLTextAreaElement ||
	ref instanceof HTMLButtonElement;
