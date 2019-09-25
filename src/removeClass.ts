import { Collection } from "./utils/types";
import { trimAndSplit } from "./utils/trimAndSplit";

export const removeClass = (className: string) => (collection: Collection) => {
	const classNames = trimAndSplit(className);

	if (classNames.length) {
		return collection.map(item => {
			if (item instanceof Element) {
				item.classList.remove(...classNames);
			}

			return item;
		});
	}

	return collection;
}
	