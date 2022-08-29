import { EMAIL_PLACEHOLDER } from "../constants";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: "`placeholder` for Email node parameter must exist.",
			recommended: "error",
		},
		fixable: "code",
		schema: [],
		messages: {
			missingEmail: `Add "placeholder: '${EMAIL_PLACEHOLDER}'" [autofixable]`,
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node) && !id.isOption(node)) return;

				if (!id.nodeParam.isEmail(node)) return;

				const placeholder = getters.nodeParam.getPlaceholder(node);

				if (!placeholder) {
					const type = getters.nodeParam.getType(node); // insertion point

					if (!type) return;

					const { range, indentation } = utils.getInsertionArgs(type);

					context.report({
						messageId: "missingEmail",
						node,
						fix: (fixer) =>
							fixer.insertTextAfterRange(
								range,
								`\n${indentation}placeholder: '${EMAIL_PLACEHOLDER}',`
							),
					});
				}
			},
		};
	},
});
