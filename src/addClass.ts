import { Collection } from "./utils/types";

export const addClass = (className: string) => (collection: Collection) => {
	collection.forEach(item => item.classList.add(className));

	return collection;
};
