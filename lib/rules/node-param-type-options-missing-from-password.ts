import { utils } from "../ast/utils";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "layout",
		docs: {
			description:
				"`typeOptions.password` must be set to `true` in a Password node parameter, to obscure the password input.",
			recommended: "error",
		},
		fixable: "code",
		schema: [],
		messages: {
			addTypeOptionsPassword: "Add `typeOptions.password` [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				const name = getters.nodeParam.getName(node);

				if (!name || name.value !== "password") return;

				const typeOptions = getters.nodeParam.getTypeOptions(node);

				if (typeOptions?.value.password === true) return;

				const type = getters.nodeParam.getType(node);

				if (!type) return;

				const { indentation, range } = utils.getInsertionArgs(type);

				context.report({
					messageId: "addTypeOptionsPassword",
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
