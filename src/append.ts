export const append = (
	subject: Element | Text | Document | DocumentFragment
) => (item: Element | Document | DocumentFragment) => {
	item.append(subject.cloneNode(true));
	item.normalize();

	return item;
};
