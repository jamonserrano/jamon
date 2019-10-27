export const on = (
	event: string,
	listener: (e: Event) => any,
	options: EventListenerOptions = {}
) => (item: Element) => {
	item.addEventListener(event, listener, options);

	return item;
};
