import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"First char in `name` in credential class must be lowercase.",
			recommended: "error",
		},
		fixable: "code",
		schema: [],
		messages: {
			uppercaseFirstChar: "Change first char to lowercase [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ClassDeclaration(node) {
				if (!id.isCredentialClass(node)) return;

				const name = getters.credClassBody.getName(node.body);

				if (!name) return;

				const fixed = name.value.charAt(0).toLowerCase() + name.value.slice(1);

				if (/[A-Z]/.test(name.value.charAt(0))) {
					context.report({
						messageId: "uppercaseFirstChar",
						node: name.ast,
						fix: (fixer) => fixer.replaceText(name.ast, `name = '${fixed}';`),
					});
				}
			},
		};
	},
});
