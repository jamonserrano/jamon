import { Item, Collection } from "./types";

export const findInElement = (
	item: Item,
	selector: string,
	findOne: boolean
): Collection => {
	if (!(item instanceof Element)) {
		return [];
	}

	const originalId = item.id;
	const useTemporaryId = !originalId;
	const id = originalId || "jamon-temporary-id";
	const narrowSelector = `#${id} ${selector}`;

	if (useTemporaryId) {
		item.setAttribute("id", id);
	}

	const result = findOne
		? item.querySelector(narrowSelector)
		: item.querySelectorAll(narrowSelector);

	if (useTemporaryId) {
		item.removeAttribute("id");
	}

	if (!result) {
		return [];
	} else if (result instanceof Element) {
		return [result];
	} else {
		return [...result];
	}
};
