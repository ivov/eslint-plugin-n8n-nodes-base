import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";

// @TODO: Rename to node-class-description-description-empty-string

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"`color` in node class description is deprected and must not be present, except for nodes whose icon is a Font Awesome icon - usually core nodes.",
			recommended: "error",
		},
		fixable: "code",
		schema: [],
		messages: {
			removeColor: "Remove `color` property [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeClassDescription(node)) return;

				const icon = getters.nodeClassDescription.getIcon(node);

				if (icon?.value.startsWith("fa:")) return;

				const defaults = getters.nodeClassDescription.getDefaults(node);

				if (!defaults) return;

				if (
					defaults.ast.type === AST_NODE_TYPES.Property &&
					defaults.ast.value.type === AST_NODE_TYPES.ObjectExpression
				) {
					const colorProperty = defaults.ast.value.properties.find(
						(property) => {
							return (
								property.type === AST_NODE_TYPES.Property &&
								property.key.type === AST_NODE_TYPES.Identifier &&
								property.key.name === "color"
							);
						}
					);

					if (!colorProperty) return;

					const rangeToRemove = utils.getRangeToRemove({ ast: colorProperty });

					context.report({
						messageId: "removeColor",
						node: colorProperty,
						fix: (fixer) => fixer.removeRange(rangeToRemove),
					});
				}
			},
		};
	},
});
