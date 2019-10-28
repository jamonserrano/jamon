export const clone = (deep: boolean) => (
	item: Element | Text | Document | DocumentFragment
) => item.cloneNode(deep);
