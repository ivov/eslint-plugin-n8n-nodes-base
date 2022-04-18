import { DYNAMIC_OPTIONS_NODE_PARAMETER } from "../constants";
import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "layout",
		docs: {
			description: `\`displayName\` for dynamic-options-type node parameter must end with \`${DYNAMIC_OPTIONS_NODE_PARAMETER.DISPLAY_NAME_SUFFIX}\``,
			recommended: "error",
		},
		fixable: "code",
		schema: [],
		messages: {
			endWithNameOrId: `Replace with '{Entity} ${DYNAMIC_OPTIONS_NODE_PARAMETER.DISPLAY_NAME_SUFFIX}' [autofixable]`,
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				if (!id.nodeParam.isOptionsType(node)) return;

				const loadOptionsMethod = getters.nodeParam.getLoadOptionsMethod(node);

				if (!loadOptionsMethod) return;

				const displayName = getters.nodeParam.getDisplayName(node);

				if (!displayName) return;

				if (
					!displayName.value.endsWith(
						DYNAMIC_OPTIONS_NODE_PARAMETER.DISPLAY_NAME_SUFFIX
					)
				) {
					const withEndSegment = addEndSegment(displayName.value);
					const fixed = utils.keyValue("displayName", withEndSegment);

					context.report({
						messageId: "endWithNameOrId",
						node: displayName.ast,
						fix: (fixer) => {
							return fixer.replaceText(displayName.ast, fixed);
						},
					});
				}
			},
		};
	},
});

export function addEndSegment(value: string) {
	if (/\w+\sName(s?)\s*\/\s*ID(s?)/.test(value))
		return value.replace(/Name(s?)\s*\/\s*ID(s?)/, "Name or ID");

	if (/\w+\sID(s?)\s*\/\s*Name(s?)/.test(value))
		return value.replace(/ID(s?)\s*\/\s*Name(s?)/, "Name or ID");

	if (/\w+\sName(s?)$/.test(value))
		return value.replace(/Name(s?)$/, "Name or ID");

	if (/\w+\sID(s?)$/.test(value)) return value.replace(/ID(s?)$/, "Name or ID");

	if (value === "ID" || value === "Name") return "Name or ID";

	if (/Name or/.test(value)) return value.replace(/Name or/, "Name or ID");

	if (!/\s/.test(value)) return value.concat(" Name or ID");

	return value;
}
