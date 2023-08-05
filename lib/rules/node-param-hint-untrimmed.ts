import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: "`hint` in node parameter must be trimmed.",
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			trimWhitespace: "Trim whitespace [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				const isNodeParameter = id.isNodeParameter(node);

				if (!isNodeParameter) return;

				const hint = getters.nodeParam.getHint(node);

				if (!hint) return;

				const trimmed = hint.value.trim();

				if (hint.value !== trimmed) {
					const fixed = utils.keyValue("hint", trimmed);

					context.report({
						messageId: "trimWhitespace",
						node: hint.ast,
						fix: (fixer) => fixer.replaceText(hint.ast, fixed),
					});
				}
			},
		};
	},
});
