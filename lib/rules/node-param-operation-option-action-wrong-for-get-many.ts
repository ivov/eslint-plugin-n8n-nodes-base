import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { getOperationName } from "./node-param-operation-option-without-action";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"The property `action` in a Get Many option in an Operation node parameter must start with `Get many`.",
			recommended: "error",
		},
		fixable: "code",
		schema: [],
		messages: {
			changeToGetMany: "Change to 'Get many...' [autofixable]", // TODO: Add pluralize resource name
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				if (!id.nodeParam.isOperation(node) && !id.nodeParam.isAction(node)) {
					return;
				}

				const options = getters.nodeParam.getOptions(node);

				if (!options) return;

				// skip `options: [...].sort()`, see EditImage.node.ts
				if (!Array.isArray(options.ast.value.elements)) return;

				const getAllOption = options.ast.value.elements.find((option) => {
					const operationName = getOperationName(
						option.properties as TSESTree.Property[] // TODO: Type properly
					);

					return operationName === "Get All";
				});

				if (!getAllOption) return;

				const action = getAllOption.properties.find(isActionProperty);

				if (!action) return;

				const actionSentence = action.value.value;

				if (actionSentence.startsWith("Get all")) {
					const fixed = utils.keyValue(
						"action",
						actionSentence.replace("Get all", "Get many")
					);

					context.report({
						messageId: "changeToGetMany",
						node: action,
						fix: (fixer) => fixer.replaceText(action, fixed),
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
