export const after = (subject: Element) => (item: Element) => {
	item.after(subject.cloneNode());
	item.parentNode && item.parentNode.normalize();

	return item;
}