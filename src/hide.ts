import { addClass } from './addClass';
import { getHiddenClassName } from './utils/hiddenClassName';

export const hide = () =>
	addClass(getHiddenClassName());