export const before = (
	subject: Element | Text | Document | DocumentFragment
) => (item: Element | Text) => {
	item.before(subject.cloneNode());
	item.parentNode && item.parentNode.normalize();

	return item;
};
