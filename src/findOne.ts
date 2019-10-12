import { useNarrowSelector } from "./utils/useNarrowSelector";
import { wrap } from "./wrap";

export const findOne = (selector: string) => (item: Element) => {
	const [narrowSelector, cleanup] = useNarrowSelector(item, selector);
	const result = item.querySelector(narrowSelector);
	cleanup();

	return wrap(result);
};
