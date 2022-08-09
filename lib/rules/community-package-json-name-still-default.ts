import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { utils } from "../ast/utils";
import { COMMUNITY_PACKAGE_JSON } from "../constants";
import { getDefaultValue } from "../ast/utils/defaultValue";

const isTestRun = process.env.NODE_ENV === "test";
const isProdRun = !isTestRun;

export default utils.createRule({
	name: utils.getRuleName(module),
	defaultOptions: [{ name: COMMUNITY_PACKAGE_JSON.NAME }],
	meta: {
		type: "layout",
		docs: {
			description: `The \`name\` key in the \`package.json\` of a community package must be different from the default value \`${COMMUNITY_PACKAGE_JSON.NAME}\` or a user-defined default with \`name\`.`,
			recommended: "error",
		},
		schema: [
			{
				type: "object",
				properties: {
					name: {
						type: "string",
					},
				},
				additionalProperties: false,
			},
		],
		messages: {
			updateName: "Update the `name` key in package.json",
		},
	},
	create(context, options) {
		return {
			ObjectExpression(node) {
				const filename = context.getFilename();

				if (isProdRun && !filename.includes("package.json")) return;
				if (isProdRun && !id.prod.isTopLevelObjectExpression(node)) return;
				if (isTestRun && !id.test.isTopLevelObjectExpression(node)) return;

				const name = getters.communityPackageJson.getName(node);

				if (!name) return;

				const defaultName = getDefaultValue(options, "name");

				if (name.value === defaultName) {
					context.report({
						messageId: "updateName",
						node,
					});
				}
			},
		};
	},
});
