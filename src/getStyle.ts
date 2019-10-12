export const getStyle = (name: string) => (item: Element) =>
	window.getComputedStyle(item).getPropertyValue(name);
