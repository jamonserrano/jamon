import { wrap } from "./wrap";

export const create = (type: string, properties: object) =>
	wrap(Object.assign(document.createElement(type), properties));
