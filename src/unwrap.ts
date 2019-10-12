export const unwrap = <T>(collection: T[] | T): T =>
	Array.isArray(collection) ? unwrap(collection[0]) : collection;
