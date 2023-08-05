import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"`placeholder` for a URL in credential class must be prepended with `e.g.`.",
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			prependEg: "Prepend 'e.g.' [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ClassDeclaration(node) {
				if (!id.isCredentialClass(node)) return;

				const placeholder = getters.credClassBody.getPlaceholder(node.body);

				if (!placeholder) return;

				if (placeholder.value.startsWith("http")) {
					context.report({
						messageId: "prependEg",
						node: placeholder.ast,
						fix: (fixer) =>
							fixer.replaceText(
								placeholder.ast,
								`placeholder = 'e.g. ${placeholder.value}';`
							),
					});
				}
			},
		};
	},
});
