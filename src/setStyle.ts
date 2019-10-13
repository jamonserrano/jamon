export const setStyle = (name: string, value: string) => (item: Element) => {
	if (item instanceof HTMLElement) {
		item.style.setProperty(name, value);
	}

	return item;
};
