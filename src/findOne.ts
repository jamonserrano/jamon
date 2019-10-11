import { Collection } from "./utils/types";
import { useNarrowSelector } from "./utils/useNarrowSelector";
import { wrap } from "./wrap";

const find = (item: Element, selector: string): Element => {
	const [narrowSelector, cleanup] = useNarrowSelector(item, selector);
	const result = item.querySelector(narrowSelector);
	cleanup();
	return result;
};

export const findOne = (selector: string) => (collection: Collection) => {
	for (let item of collection) {
		const result = find(item, selector);
		if (result) {
			return wrap(result);
		}
	}
};
