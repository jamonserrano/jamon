export const appendTo = (target: Element) => (item: Element) => {
	target.append(item);
	target.normalize();

	return item;
};
