export const removeAttribute = (attribute: string) => (item: Element) => {
	item.removeAttribute(attribute);

	return item;
};
