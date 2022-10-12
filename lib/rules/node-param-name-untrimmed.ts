import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: '\`name\` in node parameter or in fixed collection section must be trimmed.',
			recommended: "error",
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
				const isFixedCollectionSection = id.isFixedCollectionSection(node);

				if (!isNodeParameter && !isFixedCollectionSection) return;

				const name = getters.nodeParam.getName(node);

				if (!name) return;

				const trimmed = name.value.trim();

				if (name.value !== trimmed) {
					const fixed = utils.keyValue("name", trimmed);

					context.report({
						messageId: "trimWhitespace",
						node: name.ast,
						fix: (fixer) => fixer.replaceText(name.ast, fixed),
					});
				}
			},
		};
	},
});
