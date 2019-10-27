import { wrap } from "./wrap";

export const qs = (selector: string) => wrap(document.querySelector(selector));
