export const insertAfter = (target: Element) => (item: Element) => {
	target.after(item);
	target.parentNode && target.parentNode.normalize();

	return item;
}