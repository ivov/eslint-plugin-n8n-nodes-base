/**
 * Format a template string for a rule documentation line.
 */
export function docline(
	sections: TemplateStringsArray,
	...vars: string[]
) {
	return sections.reduce((acc, templateSection, index) => {
		if (vars[index] === "") {
			vars[index] = "`''` (empty string)";
		}

		acc += templateSection + (vars[index] ?? "");

		return acc;
	}, "");
}
