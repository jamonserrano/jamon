import { Collection } from "./utils/types";
import { trimAndSplit } from "./utils/trimAndSplit";

export const toggleClass = (className: string) => (collection: Collection) => {
	const classNames = trimAndSplit(className);

	if (classNames.length) {
		collection.forEach(item => {
			if (item instanceof Element) {
				classNames.forEach(className => item.classList.toggle(className));
			}
		});
	}

	return collection;
};
