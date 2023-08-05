import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { utils } from "../ast/utils";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"In a credential class, the field `authenticate` must be typed `IAuthenticateGeneric`",
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			removeAssertionAndType:
				"Remove assertion and type field `authenticate` with `IAuthenticateGeneric` [autofixable]",
			removeAssertion: "Remove assertion [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			TSAsExpression(node) {
				if (!utils.isCredentialFile(context.getFilename())) return;

				if (
					node.typeAnnotation.type === AST_NODE_TYPES.TSTypeReference &&
					node.typeAnnotation.typeName.type === AST_NODE_TYPES.Identifier &&
					node.typeAnnotation.typeName.name === "IAuthenticateGeneric" &&
					node.parent !== undefined &&
					node.parent.type === AST_NODE_TYPES.PropertyDefinition &&
					node.parent.key.type === AST_NODE_TYPES.Identifier &&
					node.parent.key.name === "authenticate"
				) {
					const removalNode = node.typeAnnotation.typeName;
					const insertionNode = node.parent.key;
					const rangeToRemove = utils.getRangeOfAssertion(removalNode);

					if (isAlreadyTyped(insertionNode)) {
						return context.report({
							messageId: "removeAssertion",
							node,
							fix: (fixer) => fixer.removeRange(rangeToRemove),
						});
					}

					context.report({
						messageId: "removeAssertionAndType",
						node,
						fix: (fixer) => {
							// double fix
							return [
								fixer.removeRange(rangeToRemove),
								fixer.insertTextAfterRange(
									insertionNode.range,
									": IAuthenticateGeneric"
								),
							];
						},
					});
				}
			},
		};
	},
});

function isAlreadyTyped(node: TSESTree.Identifier) {
	if (!node.typeAnnotation) return false;

	return (
		node.typeAnnotation.type === AST_NODE_TYPES.TSTypeAnnotation &&
		node.typeAnnotation.typeAnnotation.type === AST_NODE_TYPES.TSArrayType &&
		node.typeAnnotation.typeAnnotation.elementType.type ===
			AST_NODE_TYPES.TSTypeReference &&
		node.typeAnnotation.typeAnnotation.elementType.typeName.type ===
			AST_NODE_TYPES.Identifier &&
		node.typeAnnotation.typeAnnotation.elementType.typeName.name ===
			"IAuthenticateGeneric"
	);
}
