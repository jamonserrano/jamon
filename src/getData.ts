export const getData = (key: string) => (item: Element) =>
	item instanceof HTMLElement ? item.dataset[key] : undefined;
