import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"`documentationUrl` field in credential class must be present.",
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			addDocumentationUrl: "Add `documentationUrl` [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ClassDeclaration(node) {
				if (!id.isCredentialClass(node)) return;

				const { body: classBody } = node;

				const documentationUrl =
					getters.credClassBody.getDocumentationUrl(classBody);

				if (!documentationUrl) {
					const displayName = getters.credClassBody.getDisplayName(classBody); // insertion point

					if (!displayName) return;

					const className = getters.credClassBody.getName(classBody);

					if (!className) return;

					const { indentation, range } = utils.getInsertionArgs(displayName);

					const fixed = className.value.replace(/(OAuth2)?Api/g, "");

					context.report({
						messageId: "addDocumentationUrl",
						node: classBody,
						fix: (fixer) =>
							fixer.insertTextAfterRange(
								range,
								`\n${indentation}documentationUrl = '${fixed}';`
							),
					});
				}
			},
		};
	},
});
