export const trimAndSplit = (value: string): Array<string> =>
	value ? value.trim().split(" ") : [];