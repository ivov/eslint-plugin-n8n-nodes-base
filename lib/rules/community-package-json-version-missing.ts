import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { utils } from "../ast/utils";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"The `version` key must be present in the `package.json` of a community package.",
			recommended: "strict",
		},
		schema: [],
		messages: {
			addVersion: "Add a `version` key to package.json",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isCommunityPackageJson(context.getFilename(), node)) return;

				if (!getters.communityPackageJson.getVersion(node)) {
					context.report({
						messageId: "addVersion",
						node,
					});
				}
			},
		};
	},
});
