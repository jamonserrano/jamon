export const setProperty = (property: string, value: any) => (
	item: Text | Element | Document | DocumentFragment | Window
) => {
	item[property] = value;

	return item;
};
