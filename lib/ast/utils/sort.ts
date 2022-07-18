import { VERSION_REGEX } from "../../constants";

export function areIdenticallySortedOptions(
	first: { name: string }[],
	second: { name: string }[]
) {
	for (let i = 0; i < first.length; i++) {
		if (first[i].name !== second[i].name) return false;
	}

	return true;
}

export function optionComparator(a: { name: string }, b: { name: string }) {
	// if version, sort in descending order
	if (VERSION_REGEX.test(a.name)) {
		if (a.name === b.name) return 0;
		return parseFloat(a.name.slice(1)) > parseFloat(b.name.slice(1)) ? -1 : 1;
	}

	return a.name.localeCompare(b.name);
}

export function areIdenticallySortedParams(
	first: { displayName: string }[],
	second: { displayName: string }[]
) {
	for (let i = 0; i < first.length; i++) {
		if (first[i].displayName !== second[i].displayName) return false;
	}

	return true;
}
