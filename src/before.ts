export const before = (subject: Element) => (item: Element) => {
	item.before(subject.cloneNode());
	item.parentNode && item.parentNode.normalize();

	return item;
}