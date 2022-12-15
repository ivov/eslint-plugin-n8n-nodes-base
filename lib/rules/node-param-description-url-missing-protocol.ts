import { DOCUMENTATION } from "../constants";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: `\`description\` in node parameter must include protocol e.g. \`https://\` when containing a URL. ${DOCUMENTATION.APPLICABLE_BY_EXTENSION_TO_DESCRIPTION_IN_OPTION}`,
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
				if (!id.isNodeParameter(node) && !id.isOption(node)) return;

				const description = getters.nodeParam.getDescription(node);

				if (!description) return;

				if (
					/<a href=/.test(description.value) &&
					!/href=["']https:\/\//.test(description.value) // opinionated: https, not http
				) {
					const withProtocol = description.value.replace(
						/href=(['"])/g,
						'href=\$1https://'
					);
					const fixed = utils.keyValue("description", withProtocol);

					context.report({
						messageId: "addProtocol",
						node: description.ast,
						fix: (fixer) => fixer.replaceText(description.ast, fixed),
					});
				}
			},
		};
	},
});
