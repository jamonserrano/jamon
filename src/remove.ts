export const remove = (item: Element) => {
	const parentNode = item.parentNode;
	item.remove();
	parentNode && parentNode.normalize();
};
