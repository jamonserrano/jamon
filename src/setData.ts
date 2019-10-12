export const setData = (key: string, value: any) => (item: Element) => {
	if (item instanceof HTMLElement) {
		item.dataset[key] = value;
	}

	return item;
}