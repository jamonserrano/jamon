export const removeProperty = (property: string) => (
	item: Text | Element | Document | DocumentFragment | Window
) => {
	delete item[property];

	return item;
};
