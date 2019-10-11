export const useNarrowSelector = (item: Element, selector: string): [string, Function] => {
	const originalId = item.id;
	const temporaryId = !originalId;
	const id = originalId || "jamon-temporary-id";
	
	if (temporaryId) {
		item.setAttribute("id", id);
	}

	return [`#${id} ${selector}`, temporaryId ? () => item.removeAttribute("id") : () => {}];
}
