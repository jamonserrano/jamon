export const replace = (target: Element | Text) => (
	item: Element | Text | Document | DocumentFragment
) => {
	target.replaceWith(item);

	return item;
};
