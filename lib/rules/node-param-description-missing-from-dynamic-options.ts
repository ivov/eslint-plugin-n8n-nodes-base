import { DYNAMIC_OPTIONS_NODE_PARAMETER } from "../constants";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"`description` in dynamic-options-type node parameter must be present.",
			recommended: "strict",
		},
		schema: [],
		fixable: "code",
		messages: {
			addStandardDescription: `Add description: '${DYNAMIC_OPTIONS_NODE_PARAMETER.DESCRIPTION}' [autofixable]`,
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				if (!id.nodeParam.isOptionsType(node)) return;

				const loadOptionsMethod = getters.nodeParam.getLoadOptionsMethod(node);

				if (!loadOptionsMethod) return;

				const description = getters.nodeParam.getDescription(node);

				if (!description) {
					const type = getters.nodeParam.getType(node); // insertion point

					if (!type) return;

					const { range, indentation } = utils.getInsertionArgs(type);

					context.report({
						messageId: "addStandardDescription",
						node: type.ast,
						fix: (fixer) =>
							fixer.insertTextAfterRange(
								range,
								`\n${indentation}description: '${DYNAMIC_OPTIONS_NODE_PARAMETER.DESCRIPTION}',`
							),
					});
				}
			},
		};
	},
});
