import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { utils } from "../ast/utils";
import { COMMUNITY_PACKAGE_JSON } from "../constants";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "layout",
		docs: {
			description: `The \`license\` key in the \`package.json\` of a community package must be the default value \`${COMMUNITY_PACKAGE_JSON.LICENSE}\`.`,
			recommended: "error",
		},
		schema: [],
		messages: {
			updateLicense: `Update the \`license\` key to ${COMMUNITY_PACKAGE_JSON.LICENSE} in package.json`,
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isCommunityPackageJson(context.getFilename(), node)) return;

				const license = getters.communityPackageJson.getLicense(node);

				if (!license) return;

				if (license.value !== COMMUNITY_PACKAGE_JSON.LICENSE) {
					context.report({
						messageId: "updateLicense",
						node,
					});
				}
			},
		};
	},
});
