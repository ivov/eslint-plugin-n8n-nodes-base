import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { isExemptedFromApiSuffix } from "../ast/utils/apiSuffixExemption";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"`name` field in credential class must be suffixed with `-Api`.",
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			fixSuffix: "Suffix with '-Api' [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ClassDeclaration(node) {
				if (!id.isCredentialClass(node)) return;

				if (isExemptedFromApiSuffix(context.getFilename())) return;

				const name = getters.credClassBody.getName(node.body);

				if (!name) return;

				if (!name.value.endsWith("Api")) {
					const fixed = utils.addApiSuffix(name.value);

					context.report({
						messageId: "fixSuffix",
						node: name.ast,
						fix: (fixer) => fixer.replaceText(name.ast, `name = '${fixed}';`),
					});
				}
			},
		};
	},
});
