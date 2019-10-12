export const setProperty = (property: string, value: any) => (
	item: Element
) => {
	item[property] = value;

	return item;
};
