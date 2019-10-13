export const prepend = (subject: Element | Text) => (item: Element) => {
	item.prepend(subject.cloneNode(true));
	item.normalize();

	return item;
};
