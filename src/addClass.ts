import { Collection } from "./utils/types";
import { trimAndSplit } from "./utils/trimAndSplit";

export const addClass = (className: string) => (collection: Collection) => {
	const classNames = trimAndSplit(className);

	if (classNames.length) {
		return collection.map(item => {
			if (item instanceof Element) {
				item.classList.add(...classNames);
			}
			
			return item;
		});
	}

	return collection;
}
	