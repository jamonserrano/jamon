export const unwrap = (collection: Element[] | Element) =>
	Array.isArray(collection) ? unwrap(collection) : collection;
