import { Collection } from "./utils/types";

export const getAll = (selector: string): Collection =>
	[...document.querySelectorAll(selector)];
