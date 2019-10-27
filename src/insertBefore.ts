export const insertBefore = (target: Element) => (item: Element) => {
	target.before(item);
	target.parentNode && target.parentNode.normalize();

	return item;
};
