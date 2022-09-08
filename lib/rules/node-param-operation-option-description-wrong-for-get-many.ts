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
				"The property `description` in a Get Many option in an Operation node parameter must mention `many` instead of `all`.",
			recommended: "error",
		},
		fixable: "code",
		schema: [],
		messages: {
			changeToGetMany: "Change to '{{ newDescription }}' [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.nodeParam.isOperation(node)) return;

				const options = getters.nodeParam.getOptions(node);

				if (!options) return;

				// skip `options: [...].sort()`, see EditImage.node.ts
				if (!Array.isArray(options.ast.value.elements)) return;

				const getAllOption = options.ast.value.elements.find(
					getters.nodeParam.getGetAllOption
				);

				if (!getAllOption) return;

				const descriptionNode =
					getAllOption.properties.find(isOptionDescription);

				if (!descriptionNode) return;

				const { value: description } = descriptionNode.value;

				if (description.includes(" all ")) {
					const [start, end] = description.split(" all ");

					const newDescription = [start, "many", end].join(" ");

					const fixed = utils.keyValue("description", newDescription);

					context.report({
						messageId: "changeToGetMany",
						node: descriptionNode,
						fix: (fixer) => fixer.replaceText(descriptionNode, fixed),
						data: { newDescription },
					});
				}
			},
		};
	},
});

function isOptionDescription(
	property: TSESTree.ObjectLiteralElement
): property is TSESTree.Property & { value: { value: string } } {
	return (
		property.type === AST_NODE_TYPES.Property &&
		property.computed === false &&
		property.key.type === AST_NODE_TYPES.Identifier &&
		property.key.name === "description" &&
		property.value.type === AST_NODE_TYPES.Literal &&
		typeof property.value.value === "string"
	);
}
