export const delegate = (listener: (event: Event) => any, selector: string) => (
	e: Event
) => {
	const target = e.target;
	if (target instanceof Element && target.matches(selector)) {
		listener.call(target, e);
	}
};
