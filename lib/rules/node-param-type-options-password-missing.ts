import { utils } from "../ast/utils";
import { getters } from "../ast/getters";
import {
	FALSE_POSITIVE_NODE_SENSITIVE_PARAM_NAMES,
	NODE_SENSITIVE_PARAM_NAMES,
} from "../constants";

const isFalsePositive = (paramName: string) =>
	FALSE_POSITIVE_NODE_SENSITIVE_PARAM_NAMES.includes(paramName);

const isSensitive = (paramName: string) => {
	if (isFalsePositive(paramName)) return false;

	return NODE_SENSITIVE_PARAM_NAMES.some((sensitiveName) =>
		paramName.toLowerCase().includes(sensitiveName.toLowerCase())
	);
};

const sensitiveStrings = NODE_SENSITIVE_PARAM_NAMES.map((i) => `\`${i}\``).join(
	","
);

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: `In a sensitive string-type parameter, \`typeOptions.password\` must be set to \`true\` to obscure the input. A node parameter name is sensitive if it contains the strings: ${sensitiveStrings}. See exceptions in source.`,
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			addPasswordAutofixable:
				"Add `typeOptions.password` with `true` [autofixable]",
			addPasswordNonAutofixable:
				"Add `typeOptions.password` with `true` [non-autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				const name = getters.nodeParam.getName(node);

				if (!name || !isSensitive(name.value)) return;

				const type = getters.nodeParam.getType(node);

				if (!type || type.value !== "string") return;

				const typeOptions = getters.nodeParam.getTypeOptions(node);

				if (typeOptions?.value.password === true) return;

				if (typeOptions) {
					return context.report({
						messageId: "addPasswordNonAutofixable",
						node: typeOptions.ast,
						// @TODO: Autofix this case
					});
				}

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
