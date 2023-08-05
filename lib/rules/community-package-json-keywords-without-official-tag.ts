import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { utils } from "../ast/utils";
import { COMMUNITY_PACKAGE_JSON } from "../constants";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: `The \`keywords\` value in the \`package.json\` of a community package must be an array containing the value \`'${COMMUNITY_PACKAGE_JSON.OFFICIAL_TAG}'\`.`,
			recommended: "strict",
		},
		schema: [],
		messages: {
			addOfficialTag: `Add \`${COMMUNITY_PACKAGE_JSON.OFFICIAL_TAG}\` to \`keywords\` in package.json`,
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isCommunityPackageJson(context.getFilename(), node)) return;

				const keywords = getters.communityPackageJson.getKeywords(node);

				if (!keywords) return;

				if (!hasOfficialTag(keywords)) {
					context.report({
						messageId: "addOfficialTag",
						node,
					});
				}
			},
		};
	},
});

function hasOfficialTag(keywords: {
	ast: TSESTree.ObjectLiteralElement;
	value: string;
}) {
	if (
		keywords.ast.type === AST_NODE_TYPES.Property &&
		keywords.ast.value.type === AST_NODE_TYPES.ArrayExpression
	) {
		return keywords.ast.value.elements.some(
			(element) =>
				element?.type === AST_NODE_TYPES.Literal &&
				element.value === COMMUNITY_PACKAGE_JSON.OFFICIAL_TAG
		);
	}

	return false;
}
