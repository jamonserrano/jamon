export const setStyle = (rules: { [name: string]: string }) => (
	item: Element
) => {
	if (item instanceof HTMLElement) {
		Object.entries(rules).forEach(([name, value]) =>
			item.style.setProperty(name, value)
		);
	}

	return item;
};
