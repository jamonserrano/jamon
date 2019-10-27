export const getOffset = (item: Element) =>
	item instanceof HTMLElement
		? {
				left: item.offsetLeft,
				top: item.offsetTop
		  }
		: null;
