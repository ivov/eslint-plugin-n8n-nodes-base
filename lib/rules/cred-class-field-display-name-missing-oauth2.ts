import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"`displayName` field in credential class must mention `OAuth2` if the credential is OAuth2.",
			recommended: "strict",
		},
		schema: [],
		messages: {
			addOAuth2: "Add 'OAuth2' [non-autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ClassDeclaration(node) {
				if (!id.isCredentialClass(node)) return;

				const extendsValue = getters.credClassBody.getExtendsValue(
					node.body,
					context
				);

				if (!extendsValue) return;

				const displayName = getters.credClassBody.getDisplayName(node.body);

				if (!displayName) return;

				if (
					extendsValue.includes("oAuth2Api") &&
					!displayName.value.endsWith("OAuth2 API")
				) {
					context.report({
						messageId: "addOAuth2",
						node: displayName.ast,
					});
				}
			},
		};
	},
});
