import { toggleClass } from "./toggleClass";
import { getHiddenClassName } from "./utils/hiddenClassName";

export const toggle = () => toggleClass(getHiddenClassName());
