const setPosition = ({ x, y }) => (item: Element) => {
	if (!(item instanceof HTMLElement)) {
		return;
	}

	const offsetParent = item.offsetParent || document.body;
	const parentRect = offsetParent.getBoundingClientRect();
	const computedStyle = getComputedStyle(item);
	const style = item.style;

	let originalLeft: number;
	let originalTop: number;

	if (computedStyle.position === "static") {
		// get the offset position
		originalLeft = item.offsetLeft;
		originalTop = item.offsetTop;
		// set position to relative to prevent reflow
		style.position = "relative";
	} else {
		// get the original position of relative and absolute positioned elements
		originalLeft = item.offsetLeft - (parseFloat(computedStyle.left) || 0);
		originalTop = item.offsetTop - (parseFloat(computedStyle.top) || 0);
	}

	// subtract the offsets of the element and its parent to get the absolute position
	if (x !== undefined) {
		style.left = x - originalLeft - parentRect.left + "px";
	}

	if (y !== undefined) {
		style.top = y - originalTop - parentRect.top + "px";
	}
};
