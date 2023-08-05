import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { utils } from "../ast/utils";
import { COMMUNITY_PACKAGE_JSON } from "../constants";
import { getDefaultValue } from "../ast/utils/defaultValue";
import { docline } from "../ast";

export default utils.createRule({
	name: utils.getRuleName(module),
	defaultOptions: [{ description: COMMUNITY_PACKAGE_JSON.DESCRIPTION }],
	meta: {
		type: "problem",
		docs: {
			description: docline`The \`description\` value in the \`package.json\` of a community package must be different from the default value ${COMMUNITY_PACKAGE_JSON.DESCRIPTION} or a user-defined default.`,
			recommended: "strict",
		},
		schema: [
			{
				type: "object",
				properties: {
					description: {
						type: "string",
					},
				},
				additionalProperties: false,
			},
		],
		messages: {
			updateDescription: "Update the `description` key in package.json",
		},
	},
	create(context, options) {
		return {
			ObjectExpression(node) {
				if (!id.isCommunityPackageJson(context.getFilename(), node)) return;

				const description = getters.communityPackageJson.getDescription(node);

				if (!description) return;

				const defaultDescription = getDefaultValue(options, "description");

				if (description.value === defaultDescription) {
					context.report({
						messageId: "updateDescription",
						node,
					});
				}
			},
		};
	},
});
