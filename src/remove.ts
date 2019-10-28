export const remove = (item: Element | Text) => {
	const parentNode = item.parentNode;
	item.remove();
	parentNode && parentNode.normalize();
};
