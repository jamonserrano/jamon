export const insertBefore = (target: Element | Text) => (
	item: Element | Text | Document | DocumentFragment
) => {
	target.before(item);
	target.parentNode && target.parentNode.normalize();

	return item;
};
