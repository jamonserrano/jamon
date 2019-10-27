export const delegate = (listener: (event: Event) => any, selector: string) => (
	e: Event
) => {
	const target = e.target;
	if (target instanceof HTMLElement && target.matches(selector)) {
		listener.call(target, e);
	}
};
