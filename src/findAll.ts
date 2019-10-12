import { useNarrowSelector } from "./utils/useNarrowSelector";
import { wrap } from "./wrap";

export const findAll = (selector: string) => (item: Element) => {
	const [narrowSelector, cleanup] = useNarrowSelector(item, selector);
	const result = item.querySelectorAll(narrowSelector);
	cleanup();

	return wrap(result);
};
