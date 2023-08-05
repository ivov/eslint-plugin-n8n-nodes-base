import { OptionsProperty } from "../types";
import { utils } from "../ast/utils";
import { isName } from "../ast/identifiers/nodeParameter.identifiers";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"Option `name` in options-type node parameter must not contain `*`. Use `[All]` instead.",
			recommended: "strict",
		},
		schema: [],
		fixable: "code",
		messages: {
			replaceWithAll: "Replace with '[All]' [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				if (!id.nodeParam.isOptionsType(node)) return;

				const options = getters.nodeParam.getOptions(node);

				if (!options) return;

				if (options.hasPropertyPointingToIdentifier) return;

				const starOption = getStarOptionProperty(options);

				if (starOption) {
					context.report({
						messageId: "replaceWithAll",
						node: starOption.ast,
						fix: (fixer) => fixer.replaceText(starOption.ast, "name: '[All]'"),
					});
				}
			},
		};
	},
});

function getStarOptionProperty(options: { ast: OptionsProperty }) {
	for (const element of options.ast.value.elements) {
		if (!Array.isArray(element.properties)) continue;

		for (const property of element.properties) {
			if (isName(property) && property.value.value.includes("*")) {
				return { value: property.value, ast: property };
			}
		}
	}

	return null;
}
