export const prependTo = (target: Element) => (item: Element) => {
	target.prepend(item);
	target.normalize();

	return item;
};
