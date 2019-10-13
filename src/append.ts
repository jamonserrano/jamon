export const append = (subject: Element | Text) => (item: Element) => {
	item.append(subject.cloneNode(true));
	item.normalize();

	return item;
};
