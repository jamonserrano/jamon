import { wrap } from "./wrap";

export const getAll = (selector: string) =>
	wrap(document.querySelectorAll(selector));
