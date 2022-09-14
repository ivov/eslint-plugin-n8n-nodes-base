import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"`name` field in credential class must mention `OAuth2` if the credential is OAuth2.",
			recommended: "error",
		},
		schema: [],
		messages: {
			addOAuth2: "Insert 'OAuth2' [non-autofixable]", // unpredictable input
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ClassDeclaration(node) {
				if (!id.isCredentialClass(node)) return;

				const { body: classBody } = node;

				const extendsValue = getters.credClassBody.getExtendsValue(classBody, context);

				if (!extendsValue) return;

				const name = getters.credClassBody.getName(classBody);

				if (!name) return;

				if (
					extendsValue.includes("oAuth2Api") &&
					!name.value.endsWith("OAuth2Api")
				) {
					context.report({
						messageId: "addOAuth2",
						node: name.ast,
					});
				}
			},
		};
	},
});
