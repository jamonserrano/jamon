import { Collection } from "./utils/types";
import { useNarrowSelector } from "./utils/useNarrowSelector";

const find = (item: Element, selector: string): Collection => {
	const [narrowSelector, cleanup] = useNarrowSelector(item, selector);
	const result = item.querySelector(narrowSelector);
	cleanup();
	return result ? [result] : [];
};

export const findOne = (selector: string) => (collection: Collection) => {
	for (let item of collection) {
		const result = find(item, selector);
		if (result) {
			return result;
		}
	}
};
