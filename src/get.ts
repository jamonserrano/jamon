import { wrap } from "./wrap";

export const get = (selector: string) => wrap(document.querySelector(selector));
