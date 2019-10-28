export const prependTo = (target: Element | Document | DocumentFragment) => (
	item: Element | Text
) => {
	target.prepend(item);
	target.normalize();

	return item;
};
