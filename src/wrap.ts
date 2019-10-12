export const wrap = (value: null | Element | NodeListOf<Element>) => {
	if (value === null) {
		return [];
	} else if (value instanceof Element) {
		return [value]
	} else {
		return [...value];
	}
}
