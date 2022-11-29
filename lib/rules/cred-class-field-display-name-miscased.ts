import { titleCase } from "title-case";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"`displayName` field in credential class must be title cased, except for `n8n API` and `E-goi API`",
			recommended: "error",
		},
		fixable: "code",
		schema: [],
		messages: {
			useTitleCase: "Change to title case [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ClassDeclaration(node) {
				if (!id.isCredentialClass(node)) return;

				const displayName = getters.credClassBody.getDisplayName(node.body);

				if (!displayName || EXCEPTIONS.includes(displayName.value)) return;

				if (displayName.value !== titleCase(displayName.value)) {
					context.report({
						messageId: "useTitleCase",
						node: displayName.ast,
						fix: (fixer) =>
							fixer.replaceText(
								displayName.ast,
								`displayName = '${titleCase(displayName.value)}';`
							),
					});
				}
			},
		};
	},
});

const EXCEPTIONS = ['n8n API', 'E-goi API']