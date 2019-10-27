import { wrap } from "./wrap";

export const qsa = (selector: string) =>
	wrap(document.querySelectorAll(selector));
