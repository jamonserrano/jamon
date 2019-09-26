import { Collection } from "./utils/types";
import { findInElement } from "./utils/findInElement";

export const findOne = (selector: string) => (collection: Collection) => {
	for (let item of collection) {
		const result = findInElement(item, selector, true);
		if (result) {
			return result;
		}
	}
};
