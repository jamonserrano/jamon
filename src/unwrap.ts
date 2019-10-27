export const unwrap = <T>(collectionOrItem: T[] | T): T =>
	Array.isArray(collectionOrItem) ? unwrap(collectionOrItem[0]) : collectionOrItem;
