import { Collection } from "./utils/types";

export const get = (selector: string): Collection => {
	const result = document.querySelector(selector);
	return result ? [result] : [];
};
