const toKebabCase = (str: string) =>
	str.replace(/([A-Z])/g, match => `-${match.toLowerCase()}`);

export const setStyle = (rules: { [name: string]: string }) => (
	item: Element
) => {
	if (item instanceof HTMLElement) {
		Object.entries(rules).forEach(([name, value]) =>
			item.style.setProperty(toKebabCase(name), value)
		);
	}

	return item;
};
