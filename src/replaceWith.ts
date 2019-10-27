export const replaceWith = (subject: Element) => (item: Element) => {
	item.replaceWith(subject.cloneNode());

	return item;
}