import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: `Items in collection-type node parameter must not have a \`required\` property.`,
			recommended: "error",
		},
		fixable: "code",
		schema: [],
		messages: {
			removeRequired: "Remove `required: true` [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				if (!id.nodeParam.isCollectionType(node)) return;

				const options = getters.nodeParam.getCollectionOptions(node);

				if (!options) return;

				if (options.value.every((param) => param.required === undefined)) {
					return;
				}

				if (options.ast.value.type !== AST_NODE_TYPES.ArrayExpression) return;

				const [objectExpression] = options.ast.value.elements;

				const requiredTrueProperties = objectExpression.properties.filter(
					(property) => {
						return (
							property.type === AST_NODE_TYPES.Property &&
							property.key.type === AST_NODE_TYPES.Identifier &&
							property.key.name === "required" &&
							property.value.type === AST_NODE_TYPES.Literal &&
							property.value.value === true
						);
					}
				);

				for (const property of requiredTrueProperties) {
					const rangeToRemove = utils.getRangeToRemove({ ast: property });

					context.report({
						messageId: "removeRequired",
						node: property,
						fix: (fixer) => fixer.removeRange(rangeToRemove),
					});
				}
			},
		};
	},
});
