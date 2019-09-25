import { Collection } from './utils/types';

export const create = (type: string, properties: object): Collection =>
	[Object.assign(document.createElement(type), properties)]	