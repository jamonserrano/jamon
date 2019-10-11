import { Collection } from "./utils/types";

export const hasClass = (className: string) => (collection: Collection) =>
	collection.some(item => item.classList.contains(className));
