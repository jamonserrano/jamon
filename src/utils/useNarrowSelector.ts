export const useNarrowSelector = (item: Element, selector: string): [string, () => void] => {
	const originalId = item.id;
	const temporaryId = !originalId;
	const id = originalId || "jamon-temporary-id";
	temporaryId && item.setAttribute("id", id);

	return [`#${id} ${selector}`, temporaryId ? () => item.removeAttribute("id") : () => {}];
}
