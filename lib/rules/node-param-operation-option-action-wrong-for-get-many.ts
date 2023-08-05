import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"The property `action` in a Get Many option in an Operation node parameter must start with `Get many`.",
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			changeToGetMany: "Change to 'Get many {{ resourceName }}' [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.nodeParam.isOperation(node) && !id.nodeParam.isAction(node)) {
					return;
				}

				const options = getters.nodeParam.getOptions(node);

				if (!options) return;

				// skip `options: [...].sort()`, see EditImage.node.ts
				if (!Array.isArray(options.ast.value.elements)) return;

				const getAllOption = options.ast.value.elements.find(
					getters.nodeParam.getGetAllOption
				);

				if (!getAllOption) return;

				const actionNode = getAllOption.properties.find(isActionProperty);

				if (!actionNode) return;

				const { value: action } = actionNode.value;

				const DEPRECATED_START_OF_ACTION = "Get all ";

				if (action.startsWith(DEPRECATED_START_OF_ACTION)) {
					const [_, resourceName] = action.split(DEPRECATED_START_OF_ACTION);

					const fixed = utils.keyValue(
						"action",
						action.replace(DEPRECATED_START_OF_ACTION, "Get many ")
					);

					context.report({
						messageId: "changeToGetMany",
						node: actionNode,
						fix: (fixer) => fixer.replaceText(actionNode, fixed),
						data: { resourceName },
					});
				}
			},
		};
	},
});

// TODO: Deduplicate with version in node-param-operation-option-without-action
function isActionProperty(
	property: TSESTree.ObjectLiteralElement
): property is TSESTree.Property & { value: { value: string } } {
	return (
		property.type === AST_NODE_TYPES.Property &&
		property.computed === false &&
		property.key.type === AST_NODE_TYPES.Identifier &&
		property.key.name === "action" &&
		property.value.type === AST_NODE_TYPES.Literal &&
		typeof property.value.value === "string"
	);
}
