export const on = (
	event: string,
	listener: (e: Event) => any,
	options: EventListenerOptions = {}
) => (item: Element | Document | DocumentFragment | Window) => {
	item.addEventListener(event, listener, options);

	return item;
};
