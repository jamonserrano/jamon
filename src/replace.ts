export const replace = (target: Element) => (item: Element) => {
	target.replaceWith(item);

	return item;
};
