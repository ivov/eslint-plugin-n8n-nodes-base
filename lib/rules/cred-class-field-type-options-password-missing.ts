import { utils } from "../ast/utils";
import { getters } from "../ast/getters";
import {
	CRED_SENSITIVE_CLASS_FIELDS,
	FALSE_POSITIVE_CRED_SENSITIVE_CLASS_FIELDS,
} from "../constants";

const isFalsePositive = (fieldName: string) => {
	if (fieldName.endsWith("Url")) return true;

	return FALSE_POSITIVE_CRED_SENSITIVE_CLASS_FIELDS.includes(fieldName);
};

const isSensitive = (fieldName: string) => {
	if (isFalsePositive(fieldName)) return false;

	return CRED_SENSITIVE_CLASS_FIELDS.some((sensitiveField) =>
		fieldName.toLowerCase().includes(sensitiveField.toLowerCase())
	);
};

const sensitiveStrings = CRED_SENSITIVE_CLASS_FIELDS.map(
	(i) => `\`${i}\``
).join(",");

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: `In a sensitive string-type field, \`typeOptions.password\` must be set to \`true\` to obscure the input. A field name is sensitive if it contains the strings: ${sensitiveStrings}. See exceptions in source.`,
			recommended: "error",
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
