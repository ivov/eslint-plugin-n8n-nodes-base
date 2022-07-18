import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { utils } from "../ast/utils";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "layout",
		docs: {
			description:
				"The `n8n.n8nNodesApiVersion` key must be present in the `package.json` of a community package.",
			recommended: "error",
		},
		schema: [],
		messages: {
			addN8nNodesApiVersion:
				"Add an `n8n.n8nNodesApiVersion` key to package.json",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isCommunityPackageJson(context.getFilename(), node)) return;

				const n8n = getters.communityPackageJson.getN8n(node);

				if (!n8n) return;

				if (!hasN8nNodesApiVersion(n8n)) {
					context.report({
						messageId: "addN8nNodesApiVersion",
						node,
					});
				}
			},
		};
	},
});

function hasN8nNodesApiVersion(n8n: { ast: TSESTree.ObjectLiteralElement }) {
	if (
		n8n.ast.type === AST_NODE_TYPES.Property &&
		n8n.ast.value.type === AST_NODE_TYPES.ObjectExpression
	) {
		return n8n.ast.value.properties.some(id.hasNodesApiVersion);
	}

	return false;
}
