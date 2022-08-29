import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { utils } from "../ast/utils";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { COMMUNITY_PACKAGE_JSON } from "../constants";
import { getDefaultValue } from "../ast/utils/defaultValue";
import { docline } from "../ast";

export default utils.createRule({
	name: utils.getRuleName(module),
	defaultOptions: [{ repositoryUrl: COMMUNITY_PACKAGE_JSON.REPOSITORY_URL }],
	meta: {
		type: "layout",
		docs: {
			description: docline`The \`repository.url\` value in the \`package.json\` of a community package must be different from the default value ${COMMUNITY_PACKAGE_JSON.REPOSITORY_URL} or a user-defined default.`,
			recommended: "error",
		},
		schema: [
			{
				type: "object",
				properties: {
					repositoryUrl: {
						type: "string",
					},
				},
				additionalProperties: false,
			},
		],
		messages: {
			updateRepositoryUrl: "Update the `repository.url` key in package.json",
		},
	},
	create(context, options) {
		return {
			ObjectExpression(node) {
				if (!id.isCommunityPackageJson(context.getFilename(), node)) return;

				const repository = getters.communityPackageJson.getRepository(node);

				if (!repository) return;

				const repositoryUrl = getRepositoryUrl(repository);

				if (!repositoryUrl) return;

				const defaultRepositoryUrl = getDefaultValue(options, "repositoryUrl");

				if (repositoryUrl === defaultRepositoryUrl) {
					context.report({
						messageId: "updateRepositoryUrl",
						node,
					});
				}
			},
		};
	},
});

function getRepositoryUrl(repository: { ast: TSESTree.ObjectLiteralElement }) {
	if (
		repository.ast.type === AST_NODE_TYPES.Property &&
		repository.ast.value.type === AST_NODE_TYPES.ObjectExpression
	) {
		const repositoryUrl = repository.ast.value.properties.find(
			id.hasUrlLiteral
		);

		if (!repositoryUrl) return null;

		if (
			repositoryUrl.type === AST_NODE_TYPES.Property &&
			repositoryUrl.value.type === AST_NODE_TYPES.Literal &&
			typeof repositoryUrl.value.value === "string"
		) {
			return repositoryUrl.value.value;
		}
	}

	return null;
}
