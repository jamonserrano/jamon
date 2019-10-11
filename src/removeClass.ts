import { Collection } from "./utils/types";

export const removeClass = (className: string) => (collection: Collection) => {
	collection.forEach(item => item.classList.remove(className));

	return collection;
};
