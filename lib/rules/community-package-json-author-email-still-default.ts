import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { utils } from "../ast/utils";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { COMMUNITY_PACKAGE_JSON } from "../constants";
import { getDefaultValue } from "../ast/utils/defaultValue";
import { docline } from "../ast";

export default utils.createRule({
	name: utils.getRuleName(module),
	defaultOptions: [{ authorEmail: COMMUNITY_PACKAGE_JSON.AUTHOR_EMAIL }],
	meta: {
		type: "layout",
		docs: {
			description: docline`The \`author.email\` value in the \`package.json\` of a community package must be different from the default value ${COMMUNITY_PACKAGE_JSON.AUTHOR_EMAIL} or a user-defined default.`,
			recommended: "error",
		},
		schema: [
			{
				type: "object",
				properties: {
					authorEmail: {
						type: "string",
					},
				},
				additionalProperties: false,
			},
		],
		messages: {
			updateAuthorEmail: "Update the `author.email` key in package.json",
		},
	},
	create(context, options) {
		return {
			ObjectExpression(node) {
				if (!id.isCommunityPackageJson(context.getFilename(), node)) return;

				const author = getters.communityPackageJson.getAuthor(node);

				if (!author) return;

				const authorEmail = getAuthorEmail(author);

				if (authorEmail === null) return;

				const defaultAuthorEmail = getDefaultValue(options, "authorEmail");

				if (authorEmail === defaultAuthorEmail) {
					context.report({
						messageId: "updateAuthorEmail",
						node,
					});
				}
			},
		};
	},
});

function getAuthorEmail(author: { ast: TSESTree.ObjectLiteralElement }) {
	if (
		author.ast.type === AST_NODE_TYPES.Property &&
		author.ast.value.type === AST_NODE_TYPES.ObjectExpression
	) {
		const authorEmail = author.ast.value.properties.find(id.hasEmailLiteral);

		if (authorEmail === undefined) return null;

		if (
			authorEmail.type === AST_NODE_TYPES.Property &&
			authorEmail.value.type === AST_NODE_TYPES.Literal &&
			typeof authorEmail.value.value === "string"
		) {
			return authorEmail.value.value;
		}
	}

	return null;
}
