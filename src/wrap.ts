import { Collection } from "./utils/types";

export const wrap = (item: Element): Collection => item ? [item] : [];
