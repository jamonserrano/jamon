import { Collection, Item } from "./utils/types";
import { findInElement } from "./utils/findInElement";

export const findAll = (selector: string) => (collection: Collection) =>
	collection.reduce(
		(results: Collection, item: Item) =>
			results.concat(
				findInElement(item, selector, false).filter(
					itemResult => !results.includes(itemResult)
				)
			),
		[]
	);
