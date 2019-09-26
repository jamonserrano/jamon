import { Collection } from "./utils/types";

export const hasClass = (className: string) => (collection: Collection) => {
	const trimmedClassName = className.trim();

	return (
		trimmedClassName &&
		collection.some(
			item =>
				item instanceof Element && item.classList.contains(trimmedClassName)
		)
	);
};
