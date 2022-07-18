import { DOCUMENTATION, LINE_BREAK_HTML_TAG_REGEX } from "../constants";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "layout",
		docs: {
			description: `\`description\` in node parameter must not contain an HTML line break. ${DOCUMENTATION.APPLICABLE_BY_EXTENSION_TO_DESCRIPTION_IN_OPTION}`,
			recommended: "error",
		},
		fixable: "code",
		schema: [],
		messages: {
			removeTag: "Remove line break [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node) && !id.isOption(node)) return;

				if (id.isReturnValue(node)) return;

				const description = getters.nodeParam.getDescription(node);

				if (!description) return;

				if (description.value.includes("PRIVATE KEY")) return; // <br> allowed in PEM key example

				if (LINE_BREAK_HTML_TAG_REGEX.test(description.value)) {
					const clean = description.value
						.replace(new RegExp(LINE_BREAK_HTML_TAG_REGEX, "g"), "")
						.replace(/\s{2,}/, " ");

					const fixed = utils.keyValue("description", clean);

					context.report({
						messageId: "removeTag",
						node: description.ast,
						fix: (fixer) => fixer.replaceText(description.ast, fixed),
					});
				}
			},
		};
	},
});
