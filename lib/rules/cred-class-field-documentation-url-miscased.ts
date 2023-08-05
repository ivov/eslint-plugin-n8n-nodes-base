import { camelCase } from "camel-case";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"`documentationUrl` field in credential class must be camel cased. Only applicable to nodes in the main repository.",
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			useCamelCase: "Change to camelCase [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ClassDeclaration(node) {
				if (!id.isCredentialClass(node)) return;

				const documentationUrl = getters.credClassBody.getDocumentationUrl(
					node.body
				);

				if (!documentationUrl) return;

				const camelCasedDocumentationUrl = camelCase(documentationUrl.value);

				if (documentationUrl.value !== camelCasedDocumentationUrl) {
					context.report({
						messageId: "useCamelCase",
						node: documentationUrl.ast,
						fix: (fixer) =>
							fixer.replaceText(
								documentationUrl.ast,
								`documentationUrl = '${camelCasedDocumentationUrl}';`
							),
					});
				}
			},
		};
	},
});
