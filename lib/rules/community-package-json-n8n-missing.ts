import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { utils } from "../ast/utils";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "layout",
		docs: {
			description:
				"The `n8n` key must be present in the `package.json` of a community package.",
			recommended: "error",
		},
		schema: [],
		messages: {
			addN8n: "Add an `n8n` key to package.json",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isCommunityPackageJson(context.getFilename(), node)) return;

				if (!getters.communityPackageJson.getN8n(node)) {
					context.report({
						messageId: "addN8n",
						node,
					});
				}
			},
		};
	},
});
