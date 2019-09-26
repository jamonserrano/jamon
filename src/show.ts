import { removeClass } from "./removeClass";
import { getHiddenClassName } from "./utils/hiddenClassName";

export const show = () => removeClass(getHiddenClassName());
