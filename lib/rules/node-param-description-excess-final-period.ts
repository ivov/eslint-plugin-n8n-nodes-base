import { DOCUMENTATION } from "../constants";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: `\`description\` in node parameter must end without a final period if a single-sentence description. ${DOCUMENTATION.APPLICABLE_BY_EXTENSION_TO_DESCRIPTION_IN_OPTION}`,
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			excessFinalPeriod: "Remove final period [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node) && !id.isOption(node)) return;

				const description = getters.nodeParam.getDescription(node);

				if (!description) return;

				// to prevent overlap with node-param-description-excess-inner-whitespace
				if (/\s{2,}/.test(description.value)) return;

				// to prevent overlap with node-param-description-weak
				if (id.isWeakDescription(description)) return;

				const { value } = description;

				// disregard "e.g." when checking periods
				const egLess = value.replace("e.g.", "");

				if (egLess.split(". ").length === 1 && egLess.endsWith(".")) {
					const withoutExcess = value.slice(0, value.length - 1);
					const fixed = utils.keyValue("description", withoutExcess);

					context.report({
						messageId: "excessFinalPeriod",
						node: description.ast,
						fix: (fixer) => fixer.replaceText(description.ast, fixed),
					});
				}
			},
		};
	},
});
