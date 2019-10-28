export const replaceWith = (
	subject: Element | Text | Document | DocumentFragment
) => (item: Element | Text) => {
	item.replaceWith(subject.cloneNode());

	return item;
};
