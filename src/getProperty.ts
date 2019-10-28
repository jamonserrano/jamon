export const getProperty = (property: string) => (
	item: Text | Element | Document | DocumentFragment | Window
) => item[property];
