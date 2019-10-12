import { isInput } from "./utils/isInput";

export const getValue = (item: Element) =>
	isInput(item) ? item.getAttribute("value") : undefined;
