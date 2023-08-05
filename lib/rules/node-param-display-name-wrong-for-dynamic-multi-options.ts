import { DYNAMIC_MULTI_OPTIONS_NODE_PARAMETER } from "../constants";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { plural, singular } from "pluralize";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: `\`displayName\` for dynamic-multi-options-type node parameter must end with \`${DYNAMIC_MULTI_OPTIONS_NODE_PARAMETER.DISPLAY_NAME_SUFFIX}\``,
			recommended: "strict",
		},
		schema: [],
		fixable: "code",
		messages: {
			endWithNamesOrIds: `End with '{Entity} ${DYNAMIC_MULTI_OPTIONS_NODE_PARAMETER.DISPLAY_NAME_SUFFIX}' [autofixable]`,
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				if (!id.nodeParam.isMultiOptionsType(node)) return;

				const loadOptionsMethod = getters.nodeParam.getLoadOptionsMethod(node);

				if (!loadOptionsMethod) return;

				const displayName = getters.nodeParam.getDisplayName(node);

				if (!displayName) return;

				if (
					!displayName.value.endsWith(
						DYNAMIC_MULTI_OPTIONS_NODE_PARAMETER.DISPLAY_NAME_SUFFIX
					)
				) {
					const { value: displayNameValue } = displayName;

					if (displayNameValue.endsWith("Name or ID")) {
						const [noun] = displayNameValue.split(" Name or ID");
						const entity = ensureSingular(noun);
						const fixed = utils.keyValue(
							"displayName",
							`${entity} Names or IDs`
						);

						return context.report({
							messageId: "endWithNamesOrIds",
							node: displayName.ast,
							fix: (fixer) => fixer.replaceText(displayName.ast, fixed),
						});
					}

					const parts = displayNameValue.split(" ");

					// display name too long to find entity so disregard
					// e.g. ["Properties", "with", "History"]
					if (parts.length > 2) return;

					// entity is only word, e.g. ["Contacts"] → "Contact Names or IDs"
					if (parts.length === 1) {
						const entity = ensureSingular(displayNameValue);
						const fixed = utils.keyValue(
							"displayName",
							`${entity} Names or IDs`
						);

						return context.report({
							messageId: "endWithNamesOrIds",
							node: displayName.ast,
							fix: (fixer) => fixer.replaceText(displayName.ast, fixed),
						});
					}

					// entity is second word, e.g. ["Custom Schemas"] or ["Associated Vid Names or IDs"]
					if (parts.length === 2) {
						const [adjective, noun] = parts;
						const entity = ensureSingular(noun);
						const composite = [adjective, entity].join(" ");

						const fixed = utils.keyValue(
							"displayName",
							`${composite} Names or IDs`
						);

						return context.report({
							messageId: "endWithNamesOrIds",
							node: displayName.ast,
							fix: (fixer) => fixer.replaceText(displayName.ast, fixed),
						});
					}
				}
			},
		};
	},
});

function ensureSingular(noun: string) {
	return plural(noun) === noun ? singular(noun) : noun;
}
