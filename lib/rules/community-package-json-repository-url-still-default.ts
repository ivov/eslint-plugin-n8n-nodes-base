import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { utils } from "../ast/utils";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { COMMUNITY_PACKAGE_JSON } from "../constants";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "layout",
		docs: {
			description: `The \`repository.url\` value in the \`package.json\` of a community package must be different from the default value \`${COMMUNITY_PACKAGE_JSON.REPOSITORY_URL}\`.`,
			recommended: "error",
		},
		schema: [],
		messages: {
			updateRepositoryUrl: "Update the `repository.url` key in package.json",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isCommunityPackageJson(context.getFilename(), node)) return;

				const repository = getters.communityPackageJson.getRepository(node);

				if (!repository) return;

				const repositoryUrl = getRepositoryUrl(repository);

				if (repositoryUrl === COMMUNITY_PACKAGE_JSON.REPOSITORY_URL) {
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

		if (!repositoryUrl) return false;

		if (
			repositoryUrl.type === AST_NODE_TYPES.Property &&
			repositoryUrl.value.type === AST_NODE_TYPES.Literal
		) {
			return repositoryUrl.value.value;
		}
	}

	return null;
}
