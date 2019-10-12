export const removeProperty = (property: string) => (item: Element) => {
	delete item[property];

	return item;
}