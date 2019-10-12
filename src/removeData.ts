export const removeData = (key: string) => (item: Element) => {
	if (item instanceof HTMLElement) {
		delete item.dataset[key];
	}

	return item;
};
