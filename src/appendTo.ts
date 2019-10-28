export const appendTo = (target: Element | Document | DocumentFragment) => (
	item: Element | Text | Document | DocumentFragment
) => {
	target.append(item);
	target.normalize();

	return item;
};
