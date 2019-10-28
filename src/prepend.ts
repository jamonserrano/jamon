export const prepend = (subject: Element | Text) => (
	item: Element | Document | DocumentFragment
) => {
	item.prepend(subject.cloneNode(true));
	item.normalize();

	return item;
};
