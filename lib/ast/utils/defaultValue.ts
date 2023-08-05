/**
 * Get the default value for a `*-still-default` rule,
 * either user-defined or constant.
 */
export function getDefaultValue(
	options: readonly { [optionName: string]: string }[],
	keyName:
		| "authorName"
		| "authorEmail"
		| "description"
		| "name"
		| "repositoryUrl"
) {
	// keep `!== undefined` to account for '' (empty string) as default value
	return options.find((o) => o[keyName] !== undefined)?.[keyName];
}
