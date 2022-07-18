import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { utils } from "../ast/utils";
import { COMMUNITY_PACKAGE_JSON } from "../constants";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "layout",
		docs: {
			description: `The \`description\` value in the \`package.json\` of a community package must be different from the default value \`${COMMUNITY_PACKAGE_JSON.DESCRIPTION}\`.`,
			recommended: "error",
		},
		schema: [],
		messages: {
			updateDescription: "Update the `description` key in package.json",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isCommunityPackageJson(context.getFilename(), node)) return;

				const description = getters.communityPackageJson.getDescription(node);

				if (!description) return;

				if (description.value === COMMUNITY_PACKAGE_JSON.DESCRIPTION) {
					context.report({
						messageId: "updateDescription",
						node,
					});
				}
			},
		};
	},
});
