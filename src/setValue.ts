import { isInput } from "./utils/isInput";

export const setValue = (value: any) => (item: Element) => {
	if (isInput(item)) {
		item.value = value;
	}

	return item;
};
