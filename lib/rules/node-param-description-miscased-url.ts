import { DOCUMENTATION, MISCASED_URL_REGEX } from "../constants";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "layout",
		docs: {
			description: `\`URL\` in \`description\` in node parameter must be fully uppercased. ${DOCUMENTATION.APPLICABLE_BY_EXTENSION_TO_DESCRIPTION_IN_OPTION}`,
			recommended: "error",
		},
		fixable: "code",
		schema: [],
		messages: {
			uppercaseUrl: "Use 'URL' [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node) && !id.isOption(node)) return;

				const description = getters.nodeParam.getDescription(node);

				if (!description) return;

				if (MISCASED_URL_REGEX.test(description.value)) {
					const correctlyCased = description.value
						.replace(/\burl\b/gi, "URL")
						.replace(/\burls\b/gi, "URLs");

					const fixed = utils.keyValue("description", correctlyCased);

					context.report({
						messageId: "uppercaseUrl",
						node: description.ast,
						fix: (fixer) => fixer.replaceText(description.ast, fixed),
					});
				}
			},
		};
	},
});
