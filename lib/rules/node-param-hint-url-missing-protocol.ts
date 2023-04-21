import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: `\`hint\` in node parameter must include protocol e.g. \`https://\` when containing a URL.`,
			recommended: "error",
		},
		fixable: "code",
		schema: [],
		messages: {
			addProtocol: "Prepend 'https://' [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				const hint = getters.nodeParam.getHint(node);

				if (!hint) return;

				if (
					/<a href=/.test(hint.value) &&
					!/href=["']https:\/\//.test(hint.value) // opinionated: https, not http
				) {
					const withProtocol = hint.value.replace(
						/href=(['"])/g,
						'href=\$1https://'
					);
					const fixed = utils.keyValue("hint", withProtocol);

					context.report({
						messageId: "addProtocol",
						node: hint.ast,
						fix: (fixer) => fixer.replaceText(hint.ast, fixed),
					});
				}
			},
		};
	},
});
