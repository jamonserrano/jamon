import { Collection } from "./utils/types";

export const toggleClass = (className: string) => (collection: Collection) => {
	collection.forEach(item => item.classList.toggle(className));

	return collection;
};
