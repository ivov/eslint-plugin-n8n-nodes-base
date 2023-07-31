import { utils } from "../ast/utils";
import { getters } from "../ast/getters";
import { SENSITIVE_INPUTS } from "../constants";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"In a sensitive parameter, `typeOptions.password` must be set to `true` to obscure the input.",
			recommended: "error",
		},
		fixable: "code",
		schema: [],
		messages: {
			addPasswordAutofixable: "Add `typeOptions.password` [autofixable]",
			addPasswordNonAutofixable: "Add `typeOptions.password` [non-autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				const name = getters.nodeParam.getName(node);

				if (!name || !SENSITIVE_INPUTS.has(name.value)) return;

				const typeOptions = getters.nodeParam.getTypeOptions(node);

				if (typeOptions?.value.password === true) return;

				if (typeOptions) {
					return context.report({
						messageId: "addPasswordNonAutofixable",
						node: typeOptions.ast,
						// @TODO: Autofix this case
					});
				}

				const type = getters.nodeParam.getType(node);

				if (!type) return;

				const { indentation, range } = utils.getInsertionArgs(type);

				context.report({
					messageId: "addPasswordAutofixable",
					node: type.ast,
					fix: (fixer) =>
						fixer.insertTextAfterRange(
							range,
							`\n${indentation}typeOptions: { password: true },`
						),
				});
			},
		};
	},
});
