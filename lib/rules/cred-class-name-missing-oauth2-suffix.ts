import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { RuleContext } from "@typescript-eslint/utils/dist/ts-eslint";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"Credential class name must mention `OAuth2` if the credential is OAuth2.",
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

				const extendsValue = getters.credClassBody.getExtendsValue(
					node.body,
					context
				);

				if (!extendsValue) return;

				const className = getters.getClassName(node);

				if (!className) return;

				if (
					extendsValue.includes("oAuth2Api") &&
					!className.value.endsWith("OAuth2Api")
				) {
					context.report({
						messageId: "addOAuth2",
						node: className.ast,
					});
				}
			},
		};
	},
});

function getX(context: Readonly<RuleContext<"", unknown[]>>) {
	return "whoa";
}
