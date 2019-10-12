export const toggleClass = (className: string) => (item: Element) => {
	item.classList.toggle(className);

	return item;
};
