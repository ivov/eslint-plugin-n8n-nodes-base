import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { utils } from "../ast/utils";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { COMMUNITY_PACKAGE_JSON } from "../constants";
import { getDefaultValue } from "../ast/utils/defaultValue";

export default utils.createRule({
	name: utils.getRuleName(module),
	defaultOptions: [{ authorName: COMMUNITY_PACKAGE_JSON.AUTHOR_NAME }],
	meta: {
		type: "problem",
		docs: {
			description: `The \`author.name\` value in the \`package.json\` of a community package must be different from the default value \`${COMMUNITY_PACKAGE_JSON.AUTHOR_NAME}\` or a user-defined default with \`authorName\`.`,
			recommended: "error",
		},
		schema: [
			{
				type: "object",
				properties: {
					authorName: {
						type: "string",
					},
				},
				additionalProperties: false,
			},
		],
		messages: {
			updateAuthorName: "Update the `author.name` key in package.json",
		},
	},
	create(context, options) {
		return {
			ObjectExpression(node) {
				if (!id.isCommunityPackageJson(context.getFilename(), node)) return;

				const author = getters.communityPackageJson.getAuthor(node);

				if (!author) return;

				const authorName = getAuthorName(author);

				if (authorName === null) return;

				const defaultAuthorName = getDefaultValue(options, "authorName");

				if (authorName === defaultAuthorName) {
					context.report({
						messageId: "updateAuthorName",
						node,
					});
				}
			},
		};
	},
});

function getAuthorName(author: { ast: TSESTree.ObjectLiteralElement }) {
	if (
		author.ast.type === AST_NODE_TYPES.Property &&
		author.ast.value.type === AST_NODE_TYPES.ObjectExpression
	) {
		const authorName = author.ast.value.properties.find(id.hasNameLiteral);

		if (authorName === undefined) return null;

		if (
			authorName.type === AST_NODE_TYPES.Property &&
			authorName.value.type === AST_NODE_TYPES.Literal &&
			typeof authorName.value.value === "string"
		) {
			return authorName.value.value;
		}
	}

	return null;
}
