export const off = (
	event: string,
	listener: (e: Event) => any,
	options: EventListenerOptions = {}
) => (item: Element) => {
	item.removeEventListener(event, listener, options);

	return item;
};