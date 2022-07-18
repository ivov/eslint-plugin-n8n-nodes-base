import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { utils } from "../ast/utils";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "layout",
		docs: {
			description:
				"The `keywords` key must be present in the `package.json` of a community package.",
			recommended: "error",
		},
		schema: [],
		messages: {
			addKeywords: "Add a `keywords` key to package.json",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isCommunityPackageJson(context.getFilename(), node)) return;

				if (!getters.communityPackageJson.getKeywords(node)) {
					context.report({
						messageId: "addKeywords",
						node,
					});
				}
			},
		};
	},
});
