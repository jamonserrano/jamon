export const addClass = (className: string) => (item: Element) => {
	item.classList.add(className);

	return item;
};
