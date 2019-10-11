import { Collection } from "./utils/types";
import { wrap } from "./wrap";

export const get = (selector: string): Collection =>
	wrap(document.querySelector(selector));
