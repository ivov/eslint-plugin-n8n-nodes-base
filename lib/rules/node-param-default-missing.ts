import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"`default` must be present in a node parameter, except in node parameters under `modes`.",
			recommended: "strict",
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

				if (node.parent?.parent) {
					if (
						node.parent.parent.type === AST_NODE_TYPES.Property &&
						node.parent.parent.key.type === AST_NODE_TYPES.Identifier &&
						node.parent.parent.key.name === "modes"
					) {
						return;
					}
				}

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

				if (_default?.isUnparseable) return;

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

	const options = getters.nodeParam.getOptions(nodeParamArg);
	if (!options || options.hasPropertyPointingToIdentifier) return null;

	return options.value[0] ?? null;
}
