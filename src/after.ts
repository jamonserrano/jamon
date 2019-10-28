export const after = (
	subject: Element | Text | Document | DocumentFragment
) => (item: Element | Text) => {
	item.after(subject.cloneNode());
	item.parentNode && item.parentNode.normalize();

	return item;
};
