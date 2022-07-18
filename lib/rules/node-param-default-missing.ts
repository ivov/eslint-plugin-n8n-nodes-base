import { TSESTree } from "@typescript-eslint/utils";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "layout",
		docs: {
			description: "`default` must be present in a node parameter.",
			recommended: "error",
		},
		fixable: "code",
		schema: [],
		messages: {
			addDefault: "Add a default [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node, { skipKeys: ["default"] })) return;

				const type = getters.nodeParam.getType(node); // insertion point

				if (!type) return;

				const fixValues: {
					[key: string]: "" | 0 | false | string | [] | Record<string, never>;
				} = {
					string: "",
					number: 0,
					boolean: false,
					options: getDefaultForOptionsTypeParam(node),
					multiOptions: [],
					collection: {},
					fixedCollection: {},
				};

				const _default = getters.nodeParam.getDefault(node);

				if (_default?.hasCallExpression) return;

				if (!_default) {
					const { range, indentation } = utils.getInsertionArgs(type);

					context.report({
						messageId: "addDefault",
						node,
						fix: (fixer) =>
							fixer.insertTextAfterRange(
								range,
								`\n${indentation}default: '${fixValues[type.value]}',`
							),
					});
				}
			},
		};
	},
});

function getDefaultForOptionsTypeParam(node: TSESTree.ObjectExpression) {
	const zerothOption = getZerothOption(node);

	/**
	 * If node parameter is `options` type but has no options yet, cannot autofix,
	 * so set empty string as temp fix until options have been added.
	 */
	if (!zerothOption) return "";

	return zerothOption.value;
}

function getZerothOption(nodeParamArg: TSESTree.ObjectExpression) {
	if (!id.nodeParam.isOptionsType(nodeParamArg)) return null;

	return getters.nodeParam.getOptions(nodeParamArg)?.value[0] ?? null;
}
