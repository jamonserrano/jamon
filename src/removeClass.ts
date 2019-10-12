export const removeClass = (className: string) => (item: Element) => {
	item.classList.remove(className);

	return item;
};
