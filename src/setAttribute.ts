export const setAttribute = (attribute: string, value: any) => (
	item: Element
) => {
	item.setAttribute(attribute, value);

	return item;
};
