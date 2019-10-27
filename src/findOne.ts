import { wrap } from "./wrap";

export const findOne = (selector: string) => (item: Element) => {
	const originalId = item.id;
	const didNotHaveId = !originalId;
	const id = originalId || "jamon-temporary-id";
	
	didNotHaveId && item.setAttribute("id", id);
	const result = item.querySelector(`#${id} ${selector}`);
	didNotHaveId && item.removeAttribute("id");

	return wrap(result);
};
