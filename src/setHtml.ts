export const setHtml = (html: string) => (item: Element) => {
	item.innerHTML = html;

	return item;
};
