import { Collection } from "./utils/types";
import { useNarrowSelector } from "./utils/useNarrowSelector";

const find = (item: Element, selector: string): Collection => {
	const [narrowSelector, cleanup] = useNarrowSelector(item, selector);
	const result = item.querySelectorAll(narrowSelector);
	cleanup();
	return [...result];
};

export const findAll = (selector: string) => (collection: Collection) =>
	collection.reduce(
		(results: Collection, item: Element) =>
			results.concat(
				find(item, selector).filter(itemResult => !results.includes(itemResult))
			),
		[]
	);
