import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { isExemptedFromApiSuffix } from "../ast/utils/apiSuffixExemption";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: "Credential class name must be suffixed with `-Api`.",
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

				const className = getters.getClassName(node);

				if (!className) return;

				if (!className.value.endsWith("Api")) {
					const fixed = utils.addApiSuffix(className.value);

					context.report({
						messageId: "fixSuffix",
						node: className.ast,
						fix: (fixer) => fixer.replaceText(className.ast, fixed),
					});
				}
			},
		};
	},
});
