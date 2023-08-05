import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { utils } from "../ast/utils";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"The `description` key must be present in the `package.json` of a community package.",
			recommended: "strict",
		},
		schema: [],
		messages: {
			addLicense: "Add a `license` key to package.json",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isCommunityPackageJson(context.getFilename(), node)) return;

				if (!getters.communityPackageJson.getLicense(node)) {
					context.report({
						messageId: "addLicense",
						node,
					});
				}
			},
		};
	},
});
