import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { utils } from "../ast/utils";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "layout",
		docs: {
			description:
				"The `author` key must be present in the `package.json` of a community package.",
			recommended: "error",
		},
		schema: [],
		messages: {
			addAuthor: "Add an `author` key to package.json",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isCommunityPackageJson(context.getFilename(), node)) return;

				if (!getters.communityPackageJson.getAuthor(node)) {
					context.report({
						messageId: "addAuthor",
						node,
					});
				}
			},
		};
	},
});
