import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { utils } from "../ast/utils";
import { COMMUNITY_PACKAGE_JSON } from "../constants";

const isTestRun = process.env.NODE_ENV === "test";
const isProdRun = !isTestRun;

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "layout",
		docs: {
			description: `The \`name\` key in the \`package.json\` of a community package must be different from the default value \`${COMMUNITY_PACKAGE_JSON.NAME}\`.`,
			recommended: "error",
		},
		schema: [],
		messages: {
			updateName: "Update the `name` key in package.json",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				const filename = context.getFilename();

				if (isProdRun && !filename.includes("package.json")) return;
				if (isProdRun && !id.prod.isTopLevelObjectExpression(node)) return;
				if (isTestRun && !id.test.isTopLevelObjectExpression(node)) return;

				const name = getters.communityPackageJson.getName(node);

				if (!name) return;

				if (name.value === COMMUNITY_PACKAGE_JSON.NAME) {
					context.report({
						messageId: "updateName",
						node,
					});
				}
			},
		};
	},
});
